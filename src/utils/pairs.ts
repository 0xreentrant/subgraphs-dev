import { Address } from '@graphprotocol/graph-ts'
import { BIG_DECIMAL_ZERO } from '../../packages/constants'

import { Pair } from '../../generated/schema'
import { Pair as PairContract } from '../../generated/templates/Pair/Pair'
import { getToken } from './tokens'

export function getPair(
  address: Address,
): Pair | null {
  let pair = Pair.load(address.toHexString())

  if (pair === null) {
    const pairContract = PairContract.bind(address)

    const token0Address = pairContract.token0()
    const token0 = getToken(token0Address)

    if (token0 === null) {
      return null
    }

    const token1Address = pairContract.token1()
    const token1 = getToken(token1Address)

    if (token1 === null) {
      return null
    }

    pair = new Pair(address.toHex())

    token0.save()
    token1.save()

    pair.token0 = token0.id
    pair.token1 = token1.id

    pair.reserve0 = BIG_DECIMAL_ZERO
    pair.reserve1 = BIG_DECIMAL_ZERO
    pair.totalSupply = BIG_DECIMAL_ZERO
  }

  return pair as Pair
}
