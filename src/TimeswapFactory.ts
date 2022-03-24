import { log } from "matchstick-as/assembly/log";

export function onCreatePair(event): void {
  log.info('pair created:\n\ntoken0: {}\ntoken1: {}\nstable: {}\npair: {}\n', [
    event.params.token0.toHex(),
    event.params.token1.toHex(),
    event.params.stable.toString(),
    event.params.pair.toHex(),
  ])
}

