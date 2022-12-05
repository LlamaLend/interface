import { dehydrate, QueryClient } from '@tanstack/react-query'
import { useNetwork } from 'wagmi'
import CollectionsContainer from '~/containers/CollectionsContainer'
import { getAllCollections } from '~/queries/useGetAllCollections'

export async function getStaticProps() {
	const queryClient = new QueryClient()

	await queryClient.prefetchQuery(['allCollections', 1, true], () => getAllCollections({ chainId: 1 }))

	return {
		props: { dehydratedState: dehydrate(queryClient) },
		revalidate: 300
	}
}

const Home = () => {
	const { chain } = useNetwork()

	// by default if wallet is not connected, show collections on ethereum
	return <CollectionsContainer chainId={chain?.id ?? 1} chainName={chain?.name ?? 'Ethereum'} />
}

export default Home
