// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract MyToken is ERC1155, Ownable, Pausable, ERC1155Burnable {
    
    using SafeERC20 for IERC20;
    IERC20 public immutable rewardsToken;
    //the amount of reward
    uint256 rewards = 2;
    //the id of NFT can transfer
    uint256 nft_id = 1;
    event Transfer(address indexed from, address indexed to, uint256 value);
    struct DataOwner {
        address wallet;
        string[] tableIds;
        bool isMember;
    }


    mapping(address => DataOwner) OwnerToData;

    DataOwner dataOwner;

    constructor(IERC20 _rewardsToken) ERC1155("Test") {
        rewardsToken = _rewardsToken;
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(uint256 id, uint256 amount, bytes memory data)
        public
        onlyOwner
    {
        _mint(msg.sender, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        _mintBatch(to, ids, amounts, data);
    }

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        whenNotPaused
        override
    {
        //Check nft id and the id of nft that client want to transfer
        if(nft_id != ids[0]) {
            require(from == address(0) || to == address(0), "This a Soulbound token. It cannot be transferred. It can only be burned by the token owner.");
        }
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    function storeTableId(address wallet, string memory id)
        public 
    {
       dataOwner.wallet = wallet;
       dataOwner.tableIds.push(id);
       OwnerToData[wallet] = dataOwner;
    }

    function readAllDaoMemberTableIds(address wallet) public onlyOwner view returns(string[] memory) {
        return OwnerToData[wallet].tableIds;
    }

    function claimRewards() external {
        require(rewards > 0, "You have no rewards to claim");
        rewardsToken.safeTransfer(msg.sender, rewards);
        emit Transfer(address(this), msg.sender, rewards);
    }
}