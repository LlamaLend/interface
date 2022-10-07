import '~/styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import type { AppProps } from 'next/app'
import * as React from 'react'
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { DehydratedState } from '@tanstack/react-query'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'
import { connectorsForWallets, lightTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { injectedWallet, rainbowWallet, metaMaskWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets'
import { SafeConnector } from '@gnosis.pm/safe-apps-wagmi'
import { useDialogState } from 'ariakit'
import { Toaster } from 'react-hot-toast'
import { LazyMotion, domAnimation } from 'framer-motion'
import TxSubmittedDialog from '~/components/TxSubmittedDialog'
import { CHAINS_CONFIGURATION } from '~/lib/constants'
import { TransactionsContext } from '~/contexts'

const { chains, provider } = configureChains(
	[chain.mainnet, chain.goerli],
	[
		jsonRpcProvider({
			rpc: (chain) => {
				if (chain.id === 1) {
					return { http: CHAINS_CONFIGURATION[1].ankrUrl }
				} else if (chain.id === 5) {
					return { http: CHAINS_CONFIGURATION[5].ankrUrl }
				} else return { http: chain.rpcUrls.default }
			}
		}),
		publicProvider()
	]
)

const connectors = connectorsForWallets([
	{
		groupName: 'Popular',
		wallets: [
			injectedWallet({ chains }),
			metaMaskWallet({ chains }),
			rainbowWallet({ chains }),
			walletConnectWallet({ chains }),
			{
				id: 'safe',
				name: 'Gnosis Safe',
				iconUrl: '/assets/gnosis.png',
				iconBackground: '#fff',
				createConnector: () => {
					return { connector: new SafeConnector({ chains }) }
				}
			}
		]
	}
])

const wagmiClient = createClient({
	autoConnect: process.env.NEXT_PUBLIC_SAFE === 'true' ? false : true,
	connectors,
	provider
})

function MyApp({ Component, pageProps }: AppProps<{ dehydratedState: DehydratedState }>) {
	const [queryClient] = React.useState(() => new QueryClient())
	const [isMounted, setIsMounted] = React.useState(false)

	React.useEffect(() => setIsMounted(true), [])

	const dialog = useDialogState()
	const txHash = React.useRef<string | null>(null)

	return (
		<LazyMotion features={domAnimation}>
			<QueryClientProvider client={queryClient}>
				<Hydrate state={pageProps.dehydratedState}>
					<WagmiConfig client={wagmiClient}>
						<RainbowKitProvider
							theme={lightTheme({
								accentColor: '#3046fb',
								accentColorForeground: 'white',
								fontStack: 'system'
							})}
							chains={chains}
							initialChain={chain.mainnet}
							showRecentTransactions={true}
							modalSize="compact"
						>
							<TransactionsContext.Provider value={{ dialog: dialog, hash: txHash }}>
								{isMounted && <Component {...pageProps} />}
							</TransactionsContext.Provider>

							<TxSubmittedDialog dialog={dialog} transactionHash={txHash} />
							<Toaster position="top-right" reverseOrder={true} />
						</RainbowKitProvider>
					</WagmiConfig>
				</Hydrate>
			</QueryClientProvider>
		</LazyMotion>
	)
}

export default MyApp
