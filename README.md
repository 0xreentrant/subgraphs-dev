Basic skeleton.

### Status:
- 3/7: token data retrieved correctly

**TODOs**
- [x] Token data pulled
- [ ] Pair data pulled

## Install

```
yarn install # download packages

graph auth https://api.thegraph.com/deploy/ <AUTH KEY> # authenticate using the key in your TheGraph account

yarn run codegen # generate assets and interfaces from schema.graphql and subgraph.yaml

yarn run deploy # deploy live

yarn run test # run tests with matchstick 
```

## Resources: 

- The best start: https://github.com/dabit3/building-a-subgraph-workshop
- Testing locally: https://www.youtube.com/watch?v=cB7o2n-QrnU&list=PLTqyKgxaGF3SNakGQwczpSGVjS_xvOv3h
- Demo testing repo: https://github.com/LimeChain/demo-subgraph
- Key subgraph AssemblyScript API docs: https://thegraph.com/docs/en/developer/assemblyscript-api/
- Assemblyscript Handbook: https://www.assemblyscript.org/introduction.html
