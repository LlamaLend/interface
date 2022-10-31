import type { NextPage } from 'next'
import { useNetwork } from 'wagmi'
import BorrowCollectionsContainer from '~/containers/BorrowCollectionsContainer'
import { getAllCollections } from '~/queries/useGetAllCollections'
import type { ICollection } from '~/types'

export async function getStaticProps() {
	const collections = await getAllCollections({ chainId: 1 })
	return {
		props: { collections },
		revalidate: 30
	}
}

const Home: NextPage<{ collections: Array<ICollection> }> = ({ collections }) => {
	const { chain } = useNetwork()

	// by default if wallet is not connected, show collections on ethereum
	return (
		<BorrowCollectionsContainer
			chainId={chain?.id ?? 1}
			chainName={chain?.name ?? 'Ethereum'}
			collections={collections}
		/>
	)
}

export default Home
