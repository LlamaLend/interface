import { useNetwork, useQuery } from 'wagmi'
import { chainConfig } from '~/lib/constants'

export default function useConfig() {
	const { chain } = useNetwork()

	return useQuery(['config', chain?.id], () => {
		return {
			...(chain?.id && !chain?.unsupported ? chainConfig[chain.id] : chainConfig[1]),
			blockExplorer: chain?.blockExplorers?.default ?? { url: 'https://etherscan.io', name: 'Etherscan' }
		}
	})
}
