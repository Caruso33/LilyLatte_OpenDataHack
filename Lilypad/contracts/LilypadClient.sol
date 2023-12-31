// SPDX-License-Identifier: GPLv3
pragma solidity ^0.8.6;

interface ModicumContract {
    function runModuleWithDefaultMediators(
        string calldata name,
        string calldata params
    ) external payable returns (uint256);
}

// got to testnet.lilypadnetwork.org to fund your wallet
// this contract is deployed to:
// 0x30a1b68D207c39924513424F2f9969a02eba2E2E
// 0x86406BD74F67fB3245E380294d59A5d2350Ce20e
contract LilypadClient {
    address public _contractAddress;
    ModicumContract remoteContractInstance;
    
    uint256 public lilypadFee = 4;

    struct Result {
        uint256 jobID;
        string cid;
        string httpString;
        address sender;
    }
    mapping(uint256 => address) private sendersByJobID;
    mapping(address => Result[]) userOwner;
    Result[] public results;

    event ReceivedJobResults(uint256 jobID, string cid);

    // The Modicum contract address is found here: https://github.com/bacalhau-project/lilypad-modicum/blob/main/latest.txt
    // Current: 0x422F325AA109A3038BDCb7B03Dd0331A4aC2cD1a
    constructor(address contractAddress) {
        require(
            contractAddress != address(0),
            "NaiveExamplesClient: contract cannot be zero address"
        );
        _contractAddress = contractAddress;
        remoteContractInstance = ModicumContract(contractAddress);
    }

    function setLilypadFee(uint256 _fee) public {
        lilypadFee = _fee;
    }

    function runCowsay(string memory sayWhat) public payable returns (uint256) {
        require(
            msg.value == lilypadFee * 1 ether,
            string(abi.encodePacked("Payment of Ether is required"))
        );
        return runModule("cowsay:v0.0.1", sayWhat);
    }

    function runStablediffusion(string memory prompt) public payable returns (uint256) {
        require(
            msg.value == lilypadFee * 1 ether,
            string(abi.encodePacked("Payment of Ether is required"))
        );
        return runModule("stable_diffusion:v0.0.1", prompt);
    }

    function runSDXL(string memory prompt) public payable returns (uint256) {
        require(
            msg.value == lilypadFee * 1 ether,
            string(abi.encodePacked("Payment of Ether is required"))
        );
        uint256 jobID = runModule("sdxl:v0.9-lilypad1", prompt);
        sendersByJobID[jobID] = msg.sender;
        return jobID;
    }

    // prompt has to be a cid with the structure like:
    // https://ipfs.io/ipfs/QmVSKa3uhU63YneQ4tMAsFq4UkkKhSTfHAkVcRyPDN1UmF
    function runFastChat(string memory prompt) public payable returns (uint256) {
        require(
            msg.value == lilypadFee * 1 ether,
            string(abi.encodePacked("Payment of Ether is required"))
        );
        return runModule("fastchat:v0.0.1", prompt);
    }

    function runModule(string memory name, string memory params) public payable returns (uint256) {
        require(
            msg.value == lilypadFee * 1 ether,
            string(abi.encodePacked("Payment of Ether is required"))
        );
        return remoteContractInstance.runModuleWithDefaultMediators{value: msg.value}(name, params);
    }

    // Implemented Modicum interface. This saves results to a results array
    function receiveJobResults(uint256 _jobID, string calldata _cid) public {
        Result memory jobResult = Result({
            jobID: _jobID,
            cid: _cid,
            httpString: string(abi.encodePacked("https://ipfs.io/ipfs/", _cid)),
            sender:sendersByJobID[_jobID]
        });
        results.push(jobResult);
        userOwner[sendersByJobID[_jobID]].push(jobResult);
        emit ReceivedJobResults(_jobID, _cid);
    }

    function fetchAllResults() public view returns (Result[] memory) {
        return results;
    }

    function returnUserOwner(address wallet) public view returns(Result[] memory) {
      return userOwner[wallet];
    }
}