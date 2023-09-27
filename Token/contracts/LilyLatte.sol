// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LilyLatte is ERC1155, Ownable {
    error AlreadyOwner();
    error AlreadyMember();
    error NotParticipatedInDialog();
    error TransferNotAllowed();
    error DialogAlreadyExists();
    error FeeNotCovered(uint256 dataAccessFee);
    error DialogDoesNotExist();
    error NotOwnerOfDialog();
    error AlreadyPayedOut();
    error NotMember();
    error UserNotFound();
    error OpinionPollDoesNotExist();
    error OwnerOfDialogCantVote();
    error OpinionPollAlreadyVoted();
    error DataQuestDoesNotExist();
    error NotTargetOfDataQuest();

    uint256 public constant MEMBERSHIP = 0;
    uint256 currentIndex = 1;
    uint256 noMembers = 0;

    uint256 public dataAccessFee = 0.1 ether;

    struct DataOwner {
        address wallet;
        string tableId;
        bool isMember;
        string[] dialogCids;
        string[] dataQuestCids;
        string pfpCid;
        uint256 membershipTokenId;
    }

    struct Dialog {
        string tableId;
        address ownerAddr;
        uint256 tokenId;
        uint8 requestedTimes;
    }

    struct OpinionPoll {
        address ownerAddr;
        uint64 tablelandRowId;
        uint64 pro;
        uint64 contra;
        address[] voters;
    }

    struct DataQuest {
        address ownerAddr;
        address requester;
        string questionCid;
        string answerCid;
        uint256 fee;
        uint256 tokenId;
        bool isPayedOut;
    }

    /// @dev Mapping from tokenId to dialog tableland cid
    /// @notice the id of 0 is for membership tokens
    mapping(uint256 => string) public tokenIdToDialogCid;

    /// @dev Mapping from dialog tableland cid to info struct
    mapping(string => Dialog) public dialogMap;

    /// @dev Mapping from tokenId to dataQuest struct
    mapping(string => DataQuest) public dataQuestMap;

    /// @dev Mapping owner wallet to his data
    mapping(address => DataOwner) public ownerToData;
    address[] public ownerList;

    /// @dev Mapping tableId to owner
    mapping(string => address) public tableIdToOwner;

    /// @dev all available opinionPolls
    uint64[] public opinionTablelandRowIds;

    /// @dev Mapping from tablelandRowId to array of opinion polls
    mapping(uint64 => OpinionPoll) public opinionPollMap;

    event OwnerAdded(address wallet, string tableId);
    event MemberAdded(address wallet, string tableId);
    event DialogCreated(string tableId, address ownerAddr, uint256 tokenId);
    event DialogAccessRequested(
        string dialogCid,
        address ownerAddr,
        uint256 tokenId
    );
    event PayedOutDialog(address ownerAddr, string dialogCid, uint256 tokenId);
    event OpinionPollCreated(address ownerAddr, uint256 rowId);
    event OpinionPollVoted(
        address ownerAddr,
        address voter,
        uint256 tablelandRowId,
        bool votedPro,
        uint256 pro,
        uint256 contra
    );
    event DataQuestCreated(
        address ownerAddr,
        address requester,
        string question,
        uint256 fee,
        uint256 tokenId
    );
    event PayedOutDataQuest(
        address ownerAddr,
        address requester,
        string dataQuestCid,
        uint256 tokenId
    );

    constructor() ERC1155("Lilylatte") {}

    function addOwner(string memory tableId) public {
        if (ownerToData[msg.sender].wallet != address(0)) {
            revert AlreadyOwner();
        }

        ownerToData[msg.sender].wallet = msg.sender;
        ownerToData[msg.sender].tableId = tableId;

        tableIdToOwner[tableId] = msg.sender;

        ownerList.push(msg.sender);

        emit OwnerAdded(msg.sender, tableId);
    }

    function addOwnerAsMember(string memory pfpCid) public {
        DataOwner storage dataOwner = ownerToData[msg.sender];

        if (dataOwner.isMember) {
            revert AlreadyMember();
        }

        if (ownerToData[msg.sender].dialogCids.length == 0) {
            revert NotParticipatedInDialog();
        }

        dataOwner.isMember = true;
        dataOwner.membershipTokenId = noMembers;
        noMembers = noMembers++;
        dataOwner.pfpCid = pfpCid;

        _mint(msg.sender, MEMBERSHIP, 1, "");

        emit MemberAdded(msg.sender, dataOwner.tableId);
    }

    /// @dev this token will be the gated token for data access
    /// @notice the first token the dataOwner gets, the next one data buyers
    function addNewDialog(string memory newDialogCid) public {
        tokenIdToDialogCid[currentIndex] = newDialogCid;

        Dialog memory dialog = Dialog({
            tableId: newDialogCid,
            ownerAddr: msg.sender,
            tokenId: currentIndex,
            requestedTimes: 0
        });

        if (dialogMap[newDialogCid].ownerAddr != address(0)) {
            revert DialogAlreadyExists();
        }

        dialogMap[newDialogCid] = dialog;

        ownerToData[msg.sender].dialogCids.push(newDialogCid);

        _mint(msg.sender, currentIndex, 1, "");

        emit DialogCreated(newDialogCid, msg.sender, currentIndex);

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
        dialogMap[dialogCid] = dialog;

        _mint(msg.sender, dialog.tokenId, 1, "");

        emit DialogAccessRequested(dialogCid, msg.sender, dialog.tokenId);
    }

    function receiveDialogPayout(string memory dialogCid) public payable {
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

        emit PayedOutDialog(msg.sender, dialogCid, dialog.tokenId);
    }

    /// @notice add a new opinion poll
    function addOpinionPolls(uint64[] memory tablelandRowIds) public {
        if (balanceOf(msg.sender, MEMBERSHIP) != 1) {
            revert NotMember();
        }
        // TODO: In the future, do we need to ensure a user doesn't create more than 1 batch of polls?

        for (uint256 i = 0; i < tablelandRowIds.length; i++) {
            uint64 tablelandRowId = tablelandRowIds[i];

            OpinionPoll memory poll = OpinionPoll({
                ownerAddr: msg.sender,
                tablelandRowId: tablelandRowId,
                pro: 0,
                contra: 0,
                voters: new address[](0)
            });
            opinionPollMap[tablelandRowId] = poll;

            emit OpinionPollCreated(msg.sender, tablelandRowId);

            /// @notice add tablelandRowId to opinionTablelandRowId if not present
            bool isPresent = false;
            for (uint256 j = 0; j < opinionTablelandRowIds.length; j++) {
                if (opinionTablelandRowIds[j] == tablelandRowId) {
                    isPresent = true;
                    break;
                }
            }
            if (!isPresent) {
                opinionTablelandRowIds.push(tablelandRowId);
            }
        }
    }

    /// @notice vote for pro or contra
    /// @dev only allowed for members, can't be owner of dialog
    function voteOpinionPoll(uint64 tablelandRowId, bool votePro) public {
        if (balanceOf(msg.sender, MEMBERSHIP) != 1) {
            revert NotMember();
        }

        OpinionPoll memory poll = opinionPollMap[tablelandRowId];
        if (poll.ownerAddr == address(0)) {
            revert OpinionPollDoesNotExist();
        }

        if (poll.ownerAddr == msg.sender) {
            revert OwnerOfDialogCantVote();
        }

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

        opinionPollMap[tablelandRowId] = poll;
        opinionPollMap[tablelandRowId].voters.push(msg.sender);

        emit OpinionPollVoted(
            poll.ownerAddr,
            msg.sender,
            poll.tablelandRowId,
            votePro,
            poll.pro,
            poll.contra
        );
    }

    /// @notice add a data quest to target specific user for answering bounty
    function addDataQuest(
        address ownerAddr,
        string memory questionCid
    ) public payable {
        if (msg.value < dataAccessFee) {
            revert FeeNotCovered(dataAccessFee);
        }

        DataQuest memory dataQuest = DataQuest({
            ownerAddr: ownerAddr,
            requester: msg.sender,
            questionCid: questionCid,
            answerCid: "",
            fee: msg.value,
            tokenId: currentIndex,
            isPayedOut: false
        });
        DataOwner storage dataOwner = ownerToData[ownerAddr];
        dataOwner.dataQuestCids.push(questionCid);

        dataQuestMap[questionCid] = dataQuest;

        _mint(msg.sender, currentIndex, 1, "");

        emit DataQuestCreated(
            ownerAddr,
            msg.sender,
            questionCid,
            msg.value,
            currentIndex
        );

        currentIndex += 1;
    }

    function receiveDataQuestPayout(
        string memory dataQuestCid,
        string memory answerCid
    ) public payable {
        DataQuest memory dataQuest = dataQuestMap[dataQuestCid];
        if (dataQuest.tokenId == 0) {
            revert DataQuestDoesNotExist();
        }

        DataOwner memory dataOwner = ownerToData[msg.sender];
        if (dataOwner.wallet == address(0)) {
            revert UserNotFound();
        }

        bool senderIsTarget = false;
        for (uint256 i = 0; i < dataOwner.dataQuestCids.length; i++) {
            if (
                keccak256(bytes(dataOwner.dataQuestCids[i])) ==
                keccak256(bytes(dataQuestCid))
            ) {
                senderIsTarget = true;
                break;
            }
        }

        if (!senderIsTarget) {
            revert NotTargetOfDataQuest();
        }

        dataQuest.isPayedOut = true;
        dataQuest.answerCid = answerCid;
        dataQuestMap[dataQuestCid] = dataQuest;

        payable(msg.sender).transfer(dataQuest.fee);

        emit PayedOutDataQuest(
            dataQuest.ownerAddr,
            dataQuest.requester,
            dataQuestCid,
            dataQuest.tokenId
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

    function getOwnerList() public view returns (address[] memory) {
        return ownerList;
    }

    function getOpiniontablelandRowIds() public view returns (uint64[] memory) {
        return opinionTablelandRowIds;
    }
}
