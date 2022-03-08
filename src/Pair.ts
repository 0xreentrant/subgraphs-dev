// adapted from sushiswap/sushiswap-subgraph
import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts'
import { ADDRESS_ZERO } from '../packages/constants'

import { Sync as SyncEvent, Transfer as TransferEvent } from '../generated/templates/Pair/Pair'
import { Pair } from '../generated/schema'

import { getToken } from './utils/tokens'
import { getPair } from './utils/pairs'

export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
  let bd = BigDecimal.fromString('1')
  for (let i = BigInt.fromI32(0); i.lt(decimals as BigInt); i = i.plus(BigInt.fromI32(1))) {
    bd = bd.times(BigDecimal.fromString('10'))
  }

  return bd
}

export function convertTokenToDecimal(tokenAmount: BigInt, exchangeDecimals: BigInt): BigDecimal {
  if (exchangeDecimals == BigInt.fromI32(0)) {
    return tokenAmount.toBigDecimal()
  }

  return tokenAmount.toBigDecimal().div(exponentToBigDecimal(exchangeDecimals))
}

export function onTransfer(event: TransferEvent): void {
  const address = event.address

  // liquidity token amount being transfered
  const value = event.params.value.divDecimal(BigDecimal.fromString('1e18'))

  // ignore initial transfers for first adds
  if (event.params.to == ADDRESS_ZERO && event.params.value.equals(BigInt.fromI32(1000))) {
    return
  }

  let pair = Pair.load(address.toHex())

  if (pair == null) {
    pair = new Pair(address.toHex())
  }

  if (event.params.from == ADDRESS_ZERO) {
    // update total supply
    const totalSupply = pair.totalSupply

    pair.totalSupply = totalSupply!.plus(value)
    pair.save()
  } else if (event.params.to == ADDRESS_ZERO && event.params.from.toHex() == pair.id) {
    // burns

    const totalSupply = pair.totalSupply

    pair.totalSupply = totalSupply!.minus(value)
    pair.save()
  }
}

export function onSync(event: SyncEvent): void {
  let pair = getPair(event.address)

  if (pair == null) {
    pair = new Pair(event.address.toHex())
  }

  const t0address = pair.token0
  if (t0address == null) {
    return 
  }
  const token0 = getToken(Address.fromString(t0address))
  if (token0) {
    token0.save()
  }

  const t1address = pair.token1
  if (t1address == null) {
    return 
  }
  const token1 = getToken(Address.fromString(t1address))
  if (token1) {
    token1.save()
  }

  const t0decimals = token0.decimals
  pair.reserve0 = convertTokenToDecimal(event.params.reserve0, t0decimals!)

  const t1decimals = token1.decimals
  pair.reserve1 = convertTokenToDecimal(event.params.reserve1, t1decimals!)

  pair.save()
}

