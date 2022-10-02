import type { NextPage } from 'next'
import { useNetwork } from 'wagmi'
import PoolsContainer from '~/containers/PoolsContainer'

const Home: NextPage = () => {
	const { chain } = useNetwork()

	// by default if wallet is not connected, show pools on ethereum
	return <PoolsContainer chainId={chain?.id ?? 1} chainName={chain?.name ?? 'Ethereum'} />
}

export default Home
