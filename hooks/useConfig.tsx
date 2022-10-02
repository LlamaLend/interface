import { allChains } from 'wagmi'
import { chainConfig } from '~/lib/constants'

export default function useConfig(chainId?: number | null) {
	const chain = allChains.find((c) => c.id === chainId)

	// default to config of ethereum when no chain name is provided
	return {
		...chainConfig[chainId || 1],
		blockExplorer: chain?.blockExplorers?.default ?? { url: 'https://etherscan.io', name: 'Etherscan' }
	}
}
