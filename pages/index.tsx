import type { NextPage } from 'next'
import { useNetwork } from 'wagmi'
import BorrowCollectionsContainer from '~/containers/BorrowCollectionsContainer'

const Home: NextPage = () => {
	const { chain } = useNetwork()

	// by default if wallet is not connected, show collections on ethereum
	return <BorrowCollectionsContainer chainId={chain?.id ?? 1} chainName={chain?.name ?? 'Ethereum'} />
}

export default Home
