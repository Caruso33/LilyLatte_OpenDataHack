// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@tableland/evm/contracts/utils/TablelandDeployments.sol";
import "@tableland/evm/contracts/utils/SQLHelpers.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TablelandUserDataDao is ERC721Holder, Ownable{
    uint256 public _tableId;
    string private constant _TABLE_PREFIX = "UserDataDao";
    ERC1155 public contractNft;
    
    constructor (address erc1155_) {
        contractNft = ERC1155(erc1155_);
    }

    function createTable() public onlyOwner{
        _tableId = TablelandDeployments.get().create(
            address(this),
            SQLHelpers.toCreateFromSchema(
            "id integer primary key,"
            "exchange text,"
            "data_owner_id text,"
            "summarize text", // Notice the trailing comma
            _TABLE_PREFIX
            )
        );
    }

    function insert(string[] memory values, uint256 membership) public payable {
        require(contractNft.balanceOf(msg.sender, membership) > 0, "needs to hold our NFT");
        TablelandDeployments.get().mutate(
        address(this),
        _tableId,
        SQLHelpers.toBatchInsert(
                _TABLE_PREFIX,
                _tableId,
                "exchange,data_owner_id,summarize",
                values
            )
        );
    }
}

