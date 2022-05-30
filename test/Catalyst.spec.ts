import { HTTPProvider } from 'eth-connect'
import { catalystRegistryForProvider, nameDenylistForProvider, poiListForProvider } from '../src'
import 'isomorphic-fetch'

const mainnetProvider = new HTTPProvider('https://rpc.decentraland.org/mainnet?project=catalyst-contracts-ci')
mainnetProvider.debug = true

const ropstenProvider = new HTTPProvider('https://rpc.decentraland.org/ropsten?project=catalyst-contracts-ci')
ropstenProvider.debug = true

describe('server list', () => {
  it('mainnet', async () => {
    const contract = await catalystRegistryForProvider(mainnetProvider)
    const count = (await contract.catalystCount()).toNumber()
    expect(count).toBeGreaterThan(0)

    const id = await contract.catalystIds(0)
    expect(id instanceof Uint8Array).toEqual(true)

    const data = await contract.catalystById(id)
    expect(data).toMatchObject({ owner: "0x75e1d32289679dfcB2F01fBc0e043B3d7F9Cd443", domain: "interconnected.online" })
  })

  it('ropsten', async () => {
    const contract = await catalystRegistryForProvider(ropstenProvider)
    const count = (await contract.catalystCount()).toNumber()
    expect(count).toBeGreaterThan(0)
  })
})

describe('poi list', () => {
  it('mainnet', async () => {
    const contract = await poiListForProvider(mainnetProvider)
    const count = (await contract.size()).toNumber()
    expect(count).toBeGreaterThan(0)
  })

  it('ropsten', async () => {
    const contract = await poiListForProvider(ropstenProvider)
    const count = (await contract.size()).toNumber()
    expect(count).toBeGreaterThan(0)
  })
})

describe('names list', () => {
  it('mainnet', async () => {
    const contract = await nameDenylistForProvider(mainnetProvider)
    const count = (await contract.size()).toNumber()
    expect(count).toBeGreaterThan(0)
    const first = await contract.get(0)
    expect(typeof first).toEqual('string')
    expect(first.length).toBeGreaterThan(0)
  })

  it('ropsten', async () => {
    const contract = await nameDenylistForProvider(ropstenProvider)
    const count = (await contract.size()).toNumber()
    expect(count).toBeGreaterThan(0)
  })
})
