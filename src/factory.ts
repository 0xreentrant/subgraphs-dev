import { log } from "matchstick-as/assembly/log";

import { getPair } from './utils/pairs'
import { PairCreated } from "../generated/BaseV1Factory/BaseV1Factory"
import { Pair as PairTemplate } from '../generated/templates'

/*
   type pair @entity {
id: ID!
token0: Token!
token1: Token!
isStable: Boolean!
totalSupply: BigDecimal!
reserve0: BigDecimal!
reserve1: BigDecimal!
}

type Token @entity {
id: ID!
address: Bytes
symbol: String
name: String
decimals: BigInt
chainId: Int 
logoURI: String
isWhitelisted: Boolean
}
 */

export function onPairCreated(event: PairCreated): void {
  log.info('pair created:\n\ntoken0: {}\ntoken1: {}\nstable: {}\npair: {}\n', [
    event.params.token0.toHex(),
    event.params.token1.toHex(),
    event.params.stable.toString(),
    event.params.pair.toHex(),
  ])

  //const pairAddress = event.transaction.from
  const pairAddress = event.params.pair

  const pair = getPair(event.params.pair)
  if (!pair) {
    return
  }

  pair.isStable = event.params.stable

  pair.save()
  PairTemplate.create(pairAddress)
}
