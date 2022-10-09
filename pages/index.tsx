import type { NextPage } from 'next'
import { useNetwork } from 'wagmi'
import BorrowPoolsContainer from '~/containers/BorrowPoolsContainer'

const Home: NextPage = () => {
	const { chain } = useNetwork()

	// by default if wallet is not connected, show pools on ethereum
	return <BorrowPoolsContainer chainId={chain?.id ?? 1} chainName={chain?.name ?? 'Ethereum'} />
}

export default Home
