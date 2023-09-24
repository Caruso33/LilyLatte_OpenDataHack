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

`0x86406BD74F67fB3245E380294d59A5d2350Ce20e`

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
