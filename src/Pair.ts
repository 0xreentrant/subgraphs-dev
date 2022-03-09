// adapted from sushiswap/sushiswap-subgraph
import { log, Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts'
import { ADDRESS_ZERO } from '../packages/constants'

import { Sync as SyncEvent, Transfer as TransferEvent } from '../generated/templates/Pair/Pair'
import { Pair } from '../generated/schema'

import { getToken } from './utils/tokens'
import { getPair } from './utils/pairs'
import { convertTokenToDecimal } from './utils/math'

export function onTransfer(event: TransferEvent): void {
  log.info('onTransfer event: {}', [event.address.toHexString()])

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
    log.info('Mint transfer', [])
    // mints
    const totalSupply = pair.totalSupply
    pair.totalSupply = totalSupply!.plus(value)
    pair.save()
  } else if (event.params.to == ADDRESS_ZERO && event.params.from.toHex() == pair.id) {
    log.info('Burn transfer', [])
    // burns
    const totalSupply = pair.totalSupply
    pair.totalSupply = totalSupply!.minus(value)
    pair.save()
  }
}

export function onSync(event: SyncEvent): void {
  log.info('onSync event: {}', [event.address.toHexString()])

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

  log.info('Updated reserves for pair {} {}', [token0.name, token1.name])
  log.info('reserves: {} {}', [pair.reserve0.toString(), pair.reserve0.toString()])

  pair.save()
}

