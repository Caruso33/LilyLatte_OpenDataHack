// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";

contract MyToken is ERC1155, Ownable, Pausable, ERC1155Burnable {

    struct DataOwner {
        address wallet;
        address[] otherAddresses;
        string analysis_cid;
        string[] dialogs_cids;
        bool isMember;
    }

    mapping( address => DataOwner) OwnerToData;

    constructor() ERC1155("Test") {}

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data)
        public
        onlyOwner
    {
        _mint(account, id, amount, data);
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
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    DataOwner data_owner;

    function storeAnalysisCid(string memory walletAnalysisCid)
        public 
    {
        data_owner.wallet = msg.sender;
        data_owner.analysis_cid = walletAnalysisCid;
        OwnerToData[msg.sender] = data_owner;
    }

    /*
    @param _wallet: the wallet that want to retrive the cid of analysis
    @notice we need some authenticate for this function
    */
    function retriveCid(address _wallet)
        public 
        view 
        returns(string memory) 
    {
        require(msg.sender == _wallet, "You're not Owner of this Cid!");
        return OwnerToData[_wallet].analysis_cid;
    }

    function storeInitialOwnerData(string memory walletAddressTxsAnalysisCid)
        public 
    {
        DataOwner storage data_owner_old = OwnerToData[msg.sender];
        DataOwner memory data_owner_new;
        data_owner_new.analysis_cid = walletAddressTxsAnalysisCid;
        data_owner_new.wallet = data_owner_old.wallet;
        OwnerToData[msg.sender] = data_owner_new;
    }

    function viewData()
        public 
        view 
        returns(DataOwner memory)
    {
        return OwnerToData[msg.sender];
    }
}