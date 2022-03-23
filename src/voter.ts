import { BigInt } from '@graphprotocol/graph-ts'
import { log } from "matchstick-as/assembly/log";

import { Gauge } from '../generated/schema'
import { GaugeCreated, Whitelisted } from '../generated/BaseV1Voter/BaseV1Voter'
import { getToken } from './utils/tokens'
import { BIG_DECIMAL_ZERO } from '../packages/constants'

export function onWhitelisted(event: Whitelisted): void {
  log.info('token whitelisted:\n\nwhitelister: {}\ntoken: {}\n', [
    event.params.whitelister.toHex(),
    event.params.token.toHex(),
  ])

  const tokenAddress = event.params.token

  const token = getToken(tokenAddress)
  if (!token) {
    return
  }

  token.isWhitelisted = true
  token.save()
}
