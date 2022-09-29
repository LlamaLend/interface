import { ContractInterface } from 'ethers'
import { FACTORY_ABI } from './factory.abi'
import { POOL_ABI } from './pool.abi'

const FACTORY_MAINNET = '0x4da4d56B1fe6716A055A7D3a8AD323DC321f9C75'
const FACTORY_GOERLI = '0x69BC5A5c0766fB553632071CFBFcA172e3b149A2'

const ORACLE_ADDRESS = '0x4096b3f0e89c06e98d1095da7aefdd4b38eeb1e0'

const QUOTE_SERVER_API = 'https://oracle.llamalend.com/quote'

export const chainConfig: IChainConfig = {
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
		oracleAddress: ORACLE_ADDRESS
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
		oracleAddress: ORACLE_ADDRESS
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
	}
}

export const LOCAL_STORAGE_KEY = 'llamalend'
