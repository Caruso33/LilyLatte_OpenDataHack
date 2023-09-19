# Lilypad

## Metamask

```shell
Network name: Lilypad Lalechuza testnet
New RPC URL: http://testnet.lilypadnetwork.org:8545
Chain ID: 1337
Currency symbol: lilETH
Block explorer URL: (leave blank)
```

[Faucet](http://testnet.lilypadnetwork.org/)

## Deployed addresses

`0x30a1b68D207c39924513424F2f9969a02eba2E2E`
`0x63b9f0dfa2a6a3604fb301b376dc3a5b133edd3a`

## Contract

[LilypadClient](./contracts/LilypadClient.sol)

### Jobs functions

`runCowsay`
`runStablediffusion`
`runSDXL`
`runFastChat`

### Result functions

`receiveJobResults`
`fetchAllResults`

## Compile

`yarn` - install deps

`yarn hardhat compile`

The abi [is then here](./artifacts/contracts/LilypadClient.sol/LilypadClient.json)
