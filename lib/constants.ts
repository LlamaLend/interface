import { ContractInterface, providers } from 'ethers'
import { allChains } from 'wagmi'
import { FACTORY_ABI } from './factory.abi'
import { POOL_ABI } from './pool.abi'

const FACTORY_MAINNET = '0x4da4d56B1fe6716A055A7D3a8AD323DC321f9C75'
const FACTORY_GOERLI = '0x799d939C579eF42D04d352CBD70Cd4C3D6f27B95'

const ORACLE_ADDRESS = '0x4096b3f0e89c06e98d1095da7aefdd4b38eeb1e0'

const QUOTE_SERVER_API = 'https://oracle.llamalend.com/quote'

export const CHAINS_CONFIGURATION: IChainConfig = {
	1: {
		ankrUrl: 'https://rpc.ankr.com/eth',
		alchemyUrl: 'https://eth-mainnet.g.alchemy.com/v2/5uLJQgmJyFsgKvbnnnZHuPLGtgzdSSF_',
		alchemyNftUrl: 'https://eth-mainnet.g.alchemy.com/nft/v2/5uLJQgmJyFsgKvbnnnZHuPLGtgzdSSF_/getNFTs',
		infuraUrl: 'https://mainnet.infura.io/v3/d24592b20f8b44a5a932dfb3c095d03a',
		factoryAddress: FACTORY_MAINNET,
		factoryABI: FACTORY_ABI,
		poolABI: POOL_ABI,
		ankrShortName: 'eth',
		quoteApi: `${QUOTE_SERVER_API}/1`,
		oracleAddress: ORACLE_ADDRESS,
		chainProvider: new providers.JsonRpcProvider('https://rpc.ankr.com/eth'),
		isTestnet: false,
		subgraphUrl: 'https://api.thegraph.com/subgraphs/name/0xngmi/llamalend-mainnet'
	},
	5: {
		ankrUrl: 'https://rpc.ankr.com/eth_goerli',
		alchemyUrl: 'https://eth-goerli.g.alchemy.com/v2/5uLJQgmJyFsgKvbnnnZHuPLGtgzdSSF_',
		alchemyNftUrl: 'https://eth-goerli.g.alchemy.com/nft/v2/5uLJQgmJyFsgKvbnnnZHuPLGtgzdSSF_/getNFTs',
		infuraUrl: 'https://goerli.infura.io/v3/d24592b20f8b44a5a932dfb3c095d03a',
		factoryAddress: FACTORY_GOERLI,
		factoryABI: FACTORY_ABI,
		poolABI: POOL_ABI,
		ankrShortName: 'eth_goerli',
		quoteApi: `${QUOTE_SERVER_API}/5`,
		oracleAddress: ORACLE_ADDRESS,
		chainProvider: new providers.JsonRpcProvider('https://rpc.ankr.com/eth_goerli'),
		isTestnet: true,
		subgraphUrl: 'https://api.thegraph.com/subgraphs/name/0xngmi/llamalend-goerli'
	}
}

export interface IChainConfig {
	[key: number]: {
		ankrUrl: string
		alchemyUrl: string
		alchemyNftUrl: string
		infuraUrl: string
		factoryAddress: string
		factoryABI: ContractInterface
		poolABI: ContractInterface
		ankrShortName: string
		quoteApi: string
		oracleAddress: string
		chainProvider: providers.BaseProvider
		isTestnet: boolean
		subgraphUrl: string
	}
}

export const LOCAL_STORAGE_KEY = 'llamalend'

export const SECONDS_IN_A_YEAR = 365 * 24 * 60 * 60
export const SECONDS_IN_A_DAY = 24 * 60 * 60

export const chainConfig = (chainId?: number | null) => {
	const chain = allChains.find((c) => c.id === chainId)

	// default to config of ethereum when no chain name is provided
	return {
		...CHAINS_CONFIGURATION[chainId || 1],
		nativeCurrency: chain?.nativeCurrency,
		blockExplorer: chain?.blockExplorers?.default ?? { url: 'https://etherscan.io', name: 'Etherscan' }
	}
}
