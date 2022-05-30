import RequestManager, { ContractFactory } from 'eth-connect'
import { CatalystContract, catalystDeployments, catalystAbiItems, CatalystByIdResult } from './CatalystAbi'
import { listAbiItems, denylistNamesDeployments, ListContract, poiDeployments } from './ListAbi'

// eslint-disable-next-line
export async function nameDenylistForProvider(ethereumProvider: any): Promise<ListContract> {
  const rm = new RequestManager(ethereumProvider)
  const networkId = (await rm.net_version()).toString()

  if (!(networkId in denylistNamesDeployments))
    throw new Error(`There is no deployed NameDenylist contract for networkId=${networkId}`)

  const contractAddress = denylistNamesDeployments[networkId]

  return (await new ContractFactory(rm, listAbiItems).at(contractAddress)) as any as ListContract
}

// eslint-disable-next-line
export async function poiListForProvider(ethereumProvider: any): Promise<ListContract> {
  const rm = new RequestManager(ethereumProvider)
  const networkId = (await rm.net_version()).toString()

  if (!(networkId in poiDeployments))
    throw new Error(`There is no deployed PoiDenylist contract for networkId=${networkId}`)

  const contractAddress = poiDeployments[networkId]

  return (await new ContractFactory(rm, listAbiItems).at(contractAddress)) as any as ListContract
}

// eslint-disable-next-line
export async function catalystRegistryForProvider(ethereumProvider: any): Promise<CatalystContract> {
  const rm = new RequestManager(ethereumProvider)
  const networkId = (await rm.net_version()).toString()

  if (!(networkId in catalystDeployments))
    throw new Error(`There is no deployed CatalystProxy contract for networkId=${networkId}`)

  const contractAddress = catalystDeployments[networkId]

  return (await new ContractFactory(rm, catalystAbiItems).at(contractAddress)) as any as CatalystContract
}

/** Returns the catalyst list for a specified Ethereum Provider. */
export async function getAllCatalystFromProvider(
  // eslint-disable-next-line
  etherumProvider: any
): Promise<CatalystByIdResult[]> {
  const contract = await catalystRegistryForProvider(etherumProvider)

  const count = (await contract.catalystCount()).toNumber()

  const nodes: CatalystByIdResult[] = []
  // Create an array with values from 0 to count - 1
  const indices = new Array(count).fill(0).map((_, i) => i)

  const dataPromises = indices.map((index) => contract.catalystIds(index).then((id) => contract.catalystById(id)))

  const data = await Promise.all(dataPromises)

  for (const node of data) {
    if (node.domain.startsWith('http://')) {
      console.warn(`Catalyst node domain using http protocol, skipping ${JSON.stringify(node)}`)
      continue
    }

    if (!node.domain.startsWith('https://')) {
      node.domain = 'https://' + node.domain
    }

    // trim url in case it starts/ends with a blank
    node.domain = node.domain.trim()

    nodes.push(node)
  }

  return nodes
}
