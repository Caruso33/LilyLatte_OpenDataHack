// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LilyLatte is ERC1155, Ownable {
    error AlreadyOwner();
    error AlreadyMember();
    error NotParticipatedInDialog();
    error TransferNotAllowed();
    error FeeNotCovered(uint256 dataAccessFee);
    error DialogDoesNotExist();
    error NotOwnerOfDialog();
    error AlreadyPayedOut();
    error OpinionPollDoesNotExist();
    error OpinionPollAlreadyVoted();

    uint256 public constant MEMBERSHIP = 0;
    uint256 currentIndex = 1;

    uint256 public dataAccessFee = 0.1 ether;

    struct DataOwner {
        address wallet;
        string tableId;
        bool isMember;
        string[] dialogCids;
    }

    struct Dialog {
        string tableId;
        address ownerAddr;
        uint256 tokenId;
        uint8 requestedTimes;
    }

    struct OpinionPoll {
        address ownerAddr;
        uint64 rowId;
        uint64 columnId;
        uint64 pro;
        uint64 contra;
        address[] voters;
    }

    /// @dev Mapping from tokenId to dialog tableland cid
    /// @notice the id of 0 is for membership tokens
    mapping(uint256 => string) public tokenIdToDialogCid;

    /// @dev Mapping from dialog tableland cid to info struct
    mapping(string => Dialog) public dialogMap;

    /// @dev Mapping owner wallet to his data
    mapping(address => DataOwner) public ownerToData;

    /// @dev all available tags
    string[] public opinionTags;

    /// @dev Mapping from tag to array of opinion polls
    mapping(string => OpinionPoll[]) public opinionPollMap;

    event OwnerAdded(address wallet, string tableId);
    event MemberAdded(address wallet, string tableId);
    event DialogCreated(string tableId, address ownerAddr, uint256 tokenId);
    event DialogAccessRequested(
        string dialogCid,
        address ownerAddr,
        uint256 tokenId
    );
    event PayedOut(address ownerAddr, string dialogCid, uint256 tokenId);
    event OpinionPollCreated(
        address ownerAddr,
        string tag,
        uint256 rowId,
        uint256 columnId
    );
    event OpinionPollVoted(
        address ownerAddr,
        address voter,
        string tag,
        uint256 rowId,
        uint256 columnId,
        bool votedPro,
        uint256 pro,
        uint256 contra
    );

    constructor() ERC1155("Lilylatte") {}

    function addOwner(address wallet, string memory tableId) public {
        if (ownerToData[msg.sender].wallet != address(0)) {
            revert AlreadyOwner();
        }

        ownerToData[msg.sender].wallet = wallet;
        ownerToData[msg.sender].tableId = tableId;
        ownerToData[msg.sender].isMember = false;

        emit OwnerAdded(wallet, tableId);
    }

    function addOwnerAsMember(address ownerAddr) public {
        DataOwner storage dataOwner = ownerToData[msg.sender];

        if (dataOwner.isMember) {
            revert AlreadyMember();
        }

        if (ownerToData[ownerAddr].dialogCids.length == 0) {
            revert NotParticipatedInDialog();
        }

        dataOwner.isMember = true;

        _mint(ownerAddr, MEMBERSHIP, 1, "");

        emit MemberAdded(ownerAddr, dataOwner.tableId);
    }

    /// @dev this token will be the gated token for data access
    /// @notice the first token the dataOwner gets, the next one data buyers
    function mintNewDialogToken(
        address ownerAddr,
        string memory newDialogCid
    ) public {
        tokenIdToDialogCid[currentIndex] = newDialogCid;

        Dialog memory dialog = Dialog({
            tableId: newDialogCid,
            ownerAddr: ownerAddr,
            tokenId: currentIndex,
            requestedTimes: 0
        });
        dialogMap[newDialogCid] = dialog;

        ownerToData[ownerAddr].dialogCids.push(newDialogCid);

        _mint(ownerAddr, currentIndex, 1, "");

        emit DialogCreated(newDialogCid, ownerAddr, currentIndex);

        currentIndex += 1;
    }

    /// @notice get access to the NewDialogToken by minitng a token to the sender
    function requestDialogTokenAccess(string memory dialogCid) public payable {
        if (msg.value != dataAccessFee) {
            revert FeeNotCovered(dataAccessFee);
        }

        Dialog memory dialog = dialogMap[dialogCid];
        if (dialog.tokenId == 0) {
            revert DialogDoesNotExist();
        }

        dialog.requestedTimes += 1;
        dialogMap[dialog.tableId] = dialog;

        _mint(msg.sender, dialog.tokenId, 1, "");

        emit DialogAccessRequested(dialogCid, msg.sender, dialog.tokenId);
    }

    function receivePayout(string memory dialogCid) public payable {
        Dialog memory dialog = dialogMap[dialogCid];
        if (dialog.tokenId == 0) {
            revert DialogDoesNotExist();
        }

        if (dialog.ownerAddr != msg.sender) {
            revert NotOwnerOfDialog();
        }

        if (dialog.requestedTimes == 0) {
            revert AlreadyPayedOut();
        }

        uint8 requestedTimes = dialog.requestedTimes;
        dialog.requestedTimes = 0;

        dialogMap[dialog.tableId] = dialog;

        payable(msg.sender).transfer(dataAccessFee * requestedTimes);

        emit PayedOut(msg.sender, dialogCid, dialog.tokenId);
    }

    function addOpinionPoll(
        string memory tag,
        uint64 rowId,
        uint64 columnId,
        uint64 pro,
        uint64 contra
    ) public {
        OpinionPoll memory poll = OpinionPoll({
            ownerAddr: msg.sender,
            rowId: rowId,
            columnId: columnId,
            pro: pro,
            contra: contra,
            voters: new address[](0)
        });
        opinionPollMap[tag].push(poll);

        emit OpinionPollCreated(msg.sender, tag, rowId, columnId);

        for (uint256 i = 0; i < opinionTags.length; i++) {
            if (keccak256(bytes(opinionTags[i])) == keccak256(bytes(tag))) {
                return;
            }
        }
        opinionTags.push(tag);
    }

    function voteOpinionPoll(
        string memory tag,
        uint256 pollIndex,
        bool votePro
    ) public {
        OpinionPoll[] memory polls = opinionPollMap[tag];
        if (polls.length == 0 || pollIndex >= polls.length) {
            revert OpinionPollDoesNotExist();
        }

        OpinionPoll memory poll = polls[pollIndex];

        address[] memory voters = poll.voters;
        for (uint256 i = 0; i < voters.length; i++) {
            if (voters[i] == msg.sender) {
                revert OpinionPollAlreadyVoted();
            }
        }

        if (votePro) {
            poll.pro += 1;
        } else {
            poll.contra += 1;
        }

        opinionPollMap[tag][pollIndex] = poll;
        opinionPollMap[tag][pollIndex].voters.push(msg.sender);

        emit OpinionPollVoted(
            poll.ownerAddr,
            msg.sender,
            tag,
            poll.rowId,
            poll.columnId,
            votePro,
            poll.pro,
            poll.contra
        );
    }

    /// @notice only allow transfer of ownership token
    /// no data access token should be transferable
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public override {
        if (id != MEMBERSHIP) {
            revert TransferNotAllowed();
        }

        super.safeTransferFrom(from, to, id, amount, data);
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }
}
