import { PairCreated } from "../generated/BaseV1Factory/BaseV1Factory"
import { Address, ethereum } from '@graphprotocol/graph-ts'
import { newMockEvent, test, assert, logStore } from 'matchstick-as/assembly/index'
import { log } from "matchstick-as/assembly/log";
import { onPairCreated } from '../src/Factory'

export function createNewPairCreatedEvent(token0: string, token1: string, stable: boolean, pair: string): PairCreated {
  let newPairCreatedEvent = changetype<PairCreated>(newMockEvent())

  log.info('token0: {}', [token0])
  log.info('token1: {}', [token1])
  log.info('pair: {}', [pair])

  newPairCreatedEvent.parameters = new Array()
  const token0Param = new ethereum.EventParam("token0", ethereum.Value.fromAddress(Address.fromString(token0)))
  const token1Param = new ethereum.EventParam("token1", ethereum.Value.fromAddress(Address.fromString(token1)))
  const stableParam = new ethereum.EventParam("stable", ethereum.Value.fromBoolean(stable))
  const pairParam = new ethereum.EventParam("pair", ethereum.Value.fromAddress(Address.fromString(pair)))

  newPairCreatedEvent.parameters.push(token0Param)
  newPairCreatedEvent.parameters.push(token1Param)
  newPairCreatedEvent.parameters.push(stableParam)
  newPairCreatedEvent.parameters.push(pairParam)

  return newPairCreatedEvent
}

test("Gets address correctly", () => {
  let newPairCreatedEvent = createNewPairCreatedEvent(
    "0x03e487440e41c82fab7656ed62641b0813c9c859",
    "0x91b187110b11c82fab7252bd22211b0811c9c859",
    true,
    "0x73b387330b33c82fab7252bd22233b0833c9c859",
  )

  log.info('before onPairCreated', [])

  onPairCreated(newPairCreatedEvent)

  logStore()
})
