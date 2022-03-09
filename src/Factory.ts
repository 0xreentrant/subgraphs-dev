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
  const pairAddress = event.transaction.from

  const pair = getPair(event.params.pair)
  if (!pair) {
    return
  }

  pair.isStable = event.params.stable

  pair.save()
  PairTemplate.create(pairAddress)
}
