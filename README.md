Basic skeleton.

### Status:
- 3/7: token data retrieved correctly

**TODOs**
- [x] Token data pulled
- [x] Pair data pulled
- [ ] Timeswap Pairs, Pools
- [ ] Day/Month/Year data for charts
- [ ] Gauranteed Accuracy

## Install

```
yarn install # download packages

graph auth https://api.thegraph.com/deploy/ <AUTH KEY> # authenticate using the key in your The Graph account

yarn run codegen # Run this after every update to schema.graphql and subgraph.yaml to generate assets and interfaces. 

yarn run deploy # deploy to The Graph hosted service, under your account

yarn run test # run tests with matchstick 
```

## Resources: 

- The best start: https://github.com/dabit3/building-a-subgraph-workshop
- Testing locally: 
  - Subgraph unit testing with Matchstick: https://www.youtube.com/watch?v=cB7o2n-QrnU&list=PLTqyKgxaGF3SNakGQwczpSGVjS_xvOv3h
  - Run subgraph locally w/ ganache: https://thegraph.academy/developers/local-development/
  - local subgraph tips, tricks: https://medium.com/blockrocket/dapp-development-with-a-local-subgraph-ganache-setup-566a4d4cbb
- Demo testing repo: https://github.com/LimeChain/demo-subgraph
- Key subgraph AssemblyScript API docs: https://thegraph.com/docs/en/developer/assemblyscript-api/
- Assemblyscript Handbook: https://www.assemblyscript.org/introduction.html
- Perf. tips:
  - https://discord.com/channels/438038660412342282/791444347823980604/907925024814563348
  
    ```
    - Set a startblock (Use the deployment block of the contracts)
    - Avoid call- and blockhandlers 
    - Limit the number of contract calls you perform. If you do need to perform contract calls, save the data, so you won't have to do repeated calls.
    ```
  -  Ambitious subgraphs: https://forum.thegraph.com/t/developer-highlights-3-sebastian-siemssen-ivan-herger-enzyme-finance-building-ambitious-subgraphs-part-2/2059

# Notes for future devs:

- Function signatures in `subgraph.yaml` and the ABI **must** have the correct types to the contract. That will also reflect in the generated AssemblyScript types. The Solidly contract repo said that the BaseV1Pairs had the same interface as UniswapV2Pairs, but their types and ABI were different. I chased that around for two days until it was clear that that fact was incorrect.
  - Double check that the ABI signatures match the contract.  
  - Generate an ABI with `npx solc <file> --abi` if you need to be sure, or the ABI you got was from etherscan/ftmscan.

# NOTES:

- Timeswap Pools Object to provide 

```
{
    "x": <BigInt>,
    "y": <BigInt>,
    "z": <BigInt>,
    "assetReserve": <BigInt>,
    "collateralReserve": <BigInt>, /* ???????? */
    "totalLiquidity": <BigInt>, /* TimeswapPair -> State -> totalLiquidity */
    "totalBondPrincipal": <BigInt>, /* TimeswapPair -> State -> totalClaims ->  bondPrincipal */
    "totalBondInterest": <BigInt>, /* TimeswapPair -> State -> totalClaims ->  bondInterest */
    "totalInsurancePrincipal": <BigInt>, /* TimeswapPair -> State -> totalClaims ->  insurancePrincipal */
    "totalInsuranceInterest": <BigInt>, /* TimeswapPair -> State -> totalClaims -> insuranceInterest */
    "totalDebtCreated": <BigInt>, /* TimeswapPair -> State -> totalDebtCreated */
    "assetSpot": 1,
    "collateralSpot": 2885.58,
    "fee": 196,
    "protocolFee": 17,
    "feeStored": <BigInt>,
    "protocolFeeStored": <BigInt>,
    "apr": 0.0418,
    "cdp": {
        "ratio": "491210524845024",
        "percent": 1.4174
    }
}
```
