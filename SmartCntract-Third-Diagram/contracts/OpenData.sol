// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Receiver.sol";

contract MyToken is ERC1155, Ownable, Pausable, ERC1155Burnable, ERC1155Receiver{
    using SafeMath for uint256;
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
    mapping(uint256 => uint256) tokenPrices;

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

    function mint(address to, uint256 id, uint256 amount, bytes memory data)
        public
        onlyOwner
    {
        _mint(to, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        _mintBatch(to, ids, amounts, data);
    }

    function setApprovalForAll(address operator, bool approved) 
        public 
        override
    {
        emit ApprovalForAll(msg.sender, operator, approved);
    }
    
    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        whenNotPaused
        override
    {
        //Check nft id and the id of nft that client want to transfer
        if (from == address(this) || (nft_id == ids[0] && ids.length == 1)) {
            super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
        }else {
            require(from == address(0) || to == address(0), "This a Soulbound token. It cannot be transferred. It can only be burned by the token owner.");
        }
        
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC1155, ERC1155Receiver) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function onERC1155Received(address operator, address from, uint256 id, uint256 value, bytes calldata data) public override returns(bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(address operator, address from, uint256[] calldata ids, uint256[] calldata values, bytes calldata data) public override returns(bytes4) {
        return this.onERC1155BatchReceived.selector;
    }

    function setTokenPrice(uint256 id, uint256 price) 
        public
        onlyOwner
    {
        tokenPrices[id] = price * 1 ether;
    }

    function buyToken(uint256 id, uint256 amount) 
        public 
        payable
    {
        require(msg.value >= tokenPrices[id].mul(amount), "Insufficient funds");
        _safeTransferFrom(address(this), msg.sender, id, amount, "");
    }

    function withdraw()
        public
        onlyOwner
    {
        payable(owner()).transfer(address(this).balance);
    }

    function storeTableId(address wallet, string memory id)
        public 
    {
       dataOwner.wallet = wallet;
       dataOwner.tableIds.push(id);
       OwnerToData[wallet] = dataOwner;
    }

    function readAllDaoMemberTableIds(address wallet) 
        public 
        onlyOwner 
        view returns(string[] memory) 
    {
        return OwnerToData[wallet].tableIds;
    }

    function claimRewards() 
        external 
    {
        require(rewards > 0, "You have no rewards to claim");
        rewardsToken.safeTransfer(msg.sender, rewards);
        emit Transfer(address(this), msg.sender, rewards);
    }

    function returnPrice(uint256 id) public view returns(uint256) {
        return tokenPrices[id];
    }
}