import { PairCreated } from "../generated/BaseV1Factory/BaseV1Factory"
import { Pair } from "../generated/schema"
import { getToken } from './entities/token'

export function handlePairCreated(event: PairCreated): void {
  let pair = Pair.load(event.transaction.from.toHex())

  if (!pair) {
    pair = new Pair(event.transaction.from.toHex())
  }

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

  pair.isStable = event.params.stable

  pair.token0 = getToken(event.params.token0) 
  //pair.token1 = getToken(event.params.token1)

  pair.save()
}
