import '../styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import type { AppProps } from 'next/app'
import * as React from 'react'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'
import { connectorsForWallets, wallet, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { Toaster } from 'react-hot-toast'
import { chainConfig } from '~/lib/constants'

const { chains, provider } = configureChains(
	[chain.mainnet, chain.goerli],
	[
		jsonRpcProvider({
			rpc: (chain) => {
				if (chain.id === 1) {
					return { http: chainConfig[1].ankrUrl }
				} else if (chain.id === 5) {
					return { http: chainConfig[5].ankrUrl }
				} else return { http: chain.rpcUrls.default }
			}
		}),
		publicProvider()
	]
)

const connectors = connectorsForWallets([
	{
		groupName: 'Popular',
		wallets: [wallet.rainbow({ chains }), wallet.metaMask({ chains }), wallet.walletConnect({ chains })]
	},
	{
		groupName: 'More',
		wallets: [wallet.argent({ chains }), wallet.trust({ chains }), wallet.ledger({ chains })]
	}
])

const wagmiClient = createClient({
	autoConnect: true,
	connectors,
	provider
})

function MyApp({ Component, pageProps }: AppProps) {
	const [isMounted, setIsMounted] = React.useState(false)
	React.useEffect(() => setIsMounted(true), [])

	return (
		<>
			<WagmiConfig client={wagmiClient}>
				<RainbowKitProvider
					chains={chains}
					initialChain={chain.mainnet}
					showRecentTransactions={true}
					modalSize="compact"
				>
					{isMounted && <Component {...pageProps} />}
					<Toaster position="top-right" reverseOrder={true} />
				</RainbowKitProvider>
			</WagmiConfig>
		</>
	)
}

export default MyApp
