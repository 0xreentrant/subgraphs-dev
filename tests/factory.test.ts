import { createMockedFunction, newMockEvent, test, assert, logStore } from 'matchstick-as/assembly/index'
import { log } from "matchstick-as/assembly/log";
import { Address, ethereum } from '@graphprotocol/graph-ts'

import { PairCreated } from "../generated/BaseV1Factory/BaseV1Factory"
import { onPairCreated } from '../src/factory'

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
  const toAddr = (a: string): Address => Address.fromString(a)

  /*
   * Mocks
   */

  /* token fields */

  const STABLE = true
  const TOKEN0_CONTRACT = "0x03e487440e41c82fab7656ed62641b0813c9c859"
  const TOKEN1_CONTRACT = "0x91b187110b11c82fab7252bd22211b0811c9c859"
  const PAIR_CONTRACT = "0x73b387330b33c82fab7252bd22233b0833c9c859"
  createMockedFunction(toAddr(PAIR_CONTRACT), "token0", "token0():(address)").returns([ethereum.Value.fromAddress(toAddr(TOKEN0_CONTRACT))])
  createMockedFunction(toAddr(PAIR_CONTRACT), "token1", "token1():(address)").returns([ethereum.Value.fromAddress(toAddr(TOKEN1_CONTRACT))])

  const SYMBOL_SIGNATURE = "symbol():(string)"
  createMockedFunction(toAddr(TOKEN0_CONTRACT), "symbol", SYMBOL_SIGNATURE).returns([ethereum.Value.fromString("TKN0")])
  createMockedFunction(toAddr(TOKEN1_CONTRACT), "symbol", SYMBOL_SIGNATURE).returns([ethereum.Value.fromString("TKN1")])

  const NAME_SIGNATURE = "name():(string)"
  createMockedFunction(toAddr(TOKEN0_CONTRACT), "name", NAME_SIGNATURE).returns([ethereum.Value.fromString("token 0")])
  createMockedFunction(toAddr(TOKEN1_CONTRACT), "name", NAME_SIGNATURE).returns([ethereum.Value.fromString("token 1")])

  const DECIMALS_SIGNATURE = "decimals():(uint8)"
  //createMockedFunction(toAddr(TOKEN0_CONTRACT), "decimals", DECIMALS_SIGNATURE).returns([ethereum.Value.fromI32(18)])
  //createMockedFunction(toAddr(TOKEN1_CONTRACT), "decimals", DECIMALS_SIGNATURE).returns([ethereum.Value.fromI32(18)])

  /*
   * main
   */

  const newPairCreatedEvent = createNewPairCreatedEvent(TOKEN0_CONTRACT, TOKEN1_CONTRACT, STABLE, PAIR_CONTRACT)

  log.info('before onPairCreated', [])
  onPairCreated(newPairCreatedEvent)

  logStore()
})
