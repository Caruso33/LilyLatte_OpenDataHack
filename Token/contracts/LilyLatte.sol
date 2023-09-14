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

    /// @dev Mapping from tokenId to dialog tableland cid
    /// @notice the id of 0 is for membership tokens
    mapping(uint256 => string) public tokenIdToDialogCid;

    /// @dev Mapping from dialog tableland cid to info struct
    mapping(string => Dialog) public dialogMap;

    /// @dev Mapping owner wallet to his data
    mapping(address => DataOwner) public ownerToData;

    constructor() ERC1155("Lilylatte") {}

    function addOwner(address wallet, string memory tableId) public onlyOwner {
        if (ownerToData[msg.sender].wallet == address(0)) {
            revert AlreadyOwner();
        }

        ownerToData[msg.sender].wallet = wallet;
        ownerToData[msg.sender].tableId = tableId;
        ownerToData[msg.sender].isMember = false;
    }

    function addOwnerAsMember(address ownerAddr) public onlyOwner {
        DataOwner storage dataOwner = ownerToData[msg.sender];

        if (dataOwner.isMember) {
            revert AlreadyMember();
        }

        if (ownerToData[ownerAddr].dialogCids.length == 0) {
            revert NotParticipatedInDialog();
        }

        dataOwner.isMember = true;

        _mint(ownerAddr, MEMBERSHIP, 1, "");
    }

    /// @dev this token will be the gated token for data access
    /// @notice the first token the dataOwner gets, the next one data buyers
    function mintNewDialogToken(
        address ownerAddr,
        string memory newDialogCid
    ) public onlyOwner {
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

        currentIndex += 1;
    }

    /// @notice get access to the NewDialogToken by minitng a token to the sender
    function requestDialogTokenAccess(
        string memory dialogCid
    ) public payable onlyOwner {
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
    }

    function receivePayout(
        string memory dialogCid
    ) public payable onlyOwner {
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

        dialog.requestedTimes = 0;
        dialogMap[dialog.tableId] = dialog;

        payable(msg.sender).transfer(dataAccessFee * dialog.requestedTimes);
    }

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
