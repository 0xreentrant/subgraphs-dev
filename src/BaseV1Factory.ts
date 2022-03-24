import { log } from "matchstick-as/assembly/log";

import { getPair } from './utils/pairs'
import { PairCreated } from "../generated/BaseV1Factory/BaseV1Factory"
import { Pair as PairTemplate } from '../generated/templates'

export function onPairCreated(event: PairCreated): void {
  log.info('pair created:\n\ntoken0: {}\ntoken1: {}\nstable: {}\npair: {}\n', [
    event.params.token0.toHex(),
    event.params.token1.toHex(),
    event.params.stable.toString(),
    event.params.pair.toHex(),
  ])

  const pairAddress = event.params.pair

  const pair = getPair(pairAddress)
  if (!pair) {
    return
  }

  pair.isStable = event.params.stable

  pair.save()
  PairTemplate.create(pairAddress)
}
