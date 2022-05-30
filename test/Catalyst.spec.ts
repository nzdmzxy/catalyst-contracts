import { WebSocketProvider } from 'eth-connect'
import { WebSocket } from 'ws'
import { catalystRegistryForProvider, getAllCatalystFromProvider, nameDenylistForProvider, poiListForProvider } from '../src'


describe('all tests', () => {
  const mainnetProvider = new WebSocketProvider('wss://rpc.decentraland.org/mainnet?project=catalyst-contracts-ci', { WebSocketConstructor: WebSocket })
  mainnetProvider.debug = true

  const ropstenProvider = new WebSocketProvider('wss://rpc.decentraland.org/ropsten?project=catalyst-contracts-ci', { WebSocketConstructor: WebSocket })
  ropstenProvider.debug = true

  afterAll(() => {
    mainnetProvider.dispose()
    ropstenProvider.dispose()
  })

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


  describe('Catalyst server list', () => {
    it('loads the catalysts from mainnet', async () => {
      const servers = await getAllCatalystFromProvider(mainnetProvider)
      expect(servers.length).toBeGreaterThan(0)
      expect(servers[0].id instanceof Uint8Array).toEqual(true)
      expect(typeof servers[0].owner).toEqual('string')
      expect(typeof servers[0].domain).toEqual('string')
    })

    it('loads the catalysts from ropsten', async () => {
      const servers = await getAllCatalystFromProvider(ropstenProvider)
      expect(servers.length).toBeGreaterThan(0)
      expect(servers[0].id instanceof Uint8Array).toEqual(true)
      expect(typeof servers[0].owner).toEqual('string')
      expect(typeof servers[0].domain).toEqual('string')
    })
  })
})