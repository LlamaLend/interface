import { providers } from 'ethers'
import { allChains } from 'wagmi'
import { FACTORY_ABI } from './factory.abi'
import { POOL_ABI } from './pool.abi'
import { ERC721_ABI } from './erc721.abi'

const FACTORY_MAINNET = '0x55F9F26b3d7a4459205c70994c11775629530eA5'
const FACTORY_GOERLI = '0x664885D29933c48728E85F5728808DffC40cb577'

const ORACLE_MAINNET = '0x4096b3f0e89c06e98d1095da7aefdd4b38eeb1e0'
const ORACLE_GOERLI = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'

const ORACLE_SERVER_API = 'https://oracle.llamalend.com/quote'

export const EMAIL_SERVER_API = 'https://nft.llamalend.com/email'

export const NFT_LIST = 'https://raw.githubusercontent.com/LlamaLend/nft-list/main/build/default.nftlist.json' // TODO: Update repo to self-hosted
export const NFT_LIST_VERSION = '1.0.0'
export const NFT_LIST_URL_PREFIX = 'https://icons.llamao.fi/icons/nfts'

export const CHAINS_CONFIGURATION: IChainConfig = {
	1: {
		rpcUrl: 'https://eth.llamarpc.com',
		alchemyNftUrl: 'https://eth-mainnet.g.alchemy.com/nft/v2/5uLJQgmJyFsgKvbnnnZHuPLGtgzdSSF_',
		factoryAddress: FACTORY_MAINNET,
		factoryABI: FACTORY_ABI,
		poolABI: POOL_ABI,
		quoteApi: `${ORACLE_SERVER_API}/1`,
		oracleAddress: ORACLE_MAINNET,
		chainProvider: new providers.JsonRpcProvider('https://eth.llamarpc.com'),
		isTestnet: false,
		subgraphUrl: 'https://api.thegraph.com/subgraphs/name/0xngmi/llamalend'
	},
	5: {
		rpcUrl: 'https://rpc.ankr.com/eth_goerli',
		alchemyNftUrl: 'https://eth-goerli.g.alchemy.com/nft/v2/5uLJQgmJyFsgKvbnnnZHuPLGtgzdSSF_',
		factoryAddress: FACTORY_GOERLI,
		factoryABI: FACTORY_ABI,
		poolABI: POOL_ABI,
		quoteApi: `${ORACLE_SERVER_API}/5`,
		oracleAddress: ORACLE_GOERLI,
		chainProvider: new providers.JsonRpcProvider('https://rpc.ankr.com/eth_goerli'),
		isTestnet: true,
		subgraphUrl: 'https://api.thegraph.com/subgraphs/name/0xngmi/llamalend-goerli'
	}
}

export interface IChainConfig {
	[key: number]: {
		rpcUrl: string
		alchemyNftUrl: string
		factoryAddress: string
		factoryABI: typeof FACTORY_ABI
		poolABI: typeof POOL_ABI
		quoteApi: string
		oracleAddress: string
		chainProvider: providers.BaseProvider
		isTestnet: boolean
		subgraphUrl: string
	}
}

export const LOCAL_STORAGE_KEY = 'llamalend'
export { POOL_ABI, FACTORY_ABI, ERC721_ABI }

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
