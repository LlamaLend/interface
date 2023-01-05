import { dehydrate, QueryClient } from '@tanstack/react-query'
import type { NextPage } from 'next'
import { allChains } from 'wagmi'
import CollectionsContainer from '~/containers/CollectionsContainer'
import { getAllCollections } from '~/queries/useGetAllCollections'

interface IPageProps {
	chainId: number
	chainName: string
}

const BorrowPoolsByChain: NextPage<IPageProps> = ({ chainId, chainName }) => {
	// only show pools of network user is connected to if they are on /borrow/pools, as /borrow/pools is similare index route i.e., '/'
	return <CollectionsContainer chainId={chainId} chainName={chainName} />
}

export default BorrowPoolsByChain

export async function getStaticPaths() {
	return {
		paths: [
			{ params: { chainName: 'ethereum' } },
			{ params: { chainName: '1' } },
			{ params: { chainName: 'goerli' } },
			{ params: { chainName: '5' } }
		],
		fallback: 'blocking'
	}
}

export async function getStaticProps({ params: { chainName } }: { params: { chainName: string } }) {
	const chainDetails = chainName
		? allChains.find((chain) => chain.id === Number(chainName) || chain.name.toLowerCase() === chainName.toLowerCase())
		: null

	if (!chainDetails) {
		return { notFound: true }
	}

	const queryClient = new QueryClient()

	await queryClient.prefetchQuery(['allCollections', 1, true], () => getAllCollections({ chainId: 1 }))

	return {
		props: { dehydratedState: dehydrate(queryClient), chainId: chainDetails.id, chainName: chainDetails.name },
		revalidate: 120
	}
}
