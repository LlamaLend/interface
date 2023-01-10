import { dehydrate, QueryClient } from '@tanstack/react-query'
import type { NextPage } from 'next'
import { allChains } from 'wagmi'
import BorrowContainer from '~/containers/BorrowContainer'
import collections from '~/lib/collections'
import { getAllPools } from '~/queries/useGetAllPools'

interface IPageProps {
	chainId?: number
	chainName?: string
	collectionAddress?: string
}

const BorrowPoolsByChain: NextPage<IPageProps> = ({ chainId, chainName, collectionAddress }) => {
	return <BorrowContainer chainId={chainId} chainName={chainName} collectionAddress={collectionAddress} />
}

export default BorrowPoolsByChain

export async function getStaticPaths() {
	const paths = collections[1].map((collectionAddress) => ({
		params: { chainName: 'Ethereum', address: collectionAddress }
	}))

	return {
		paths,
		fallback: 'blocking'
	}
}

export async function getStaticProps({
	params: { chainName, address }
}: {
	params: { chainName: string; address: string }
}) {
	const chainDetails = chainName
		? allChains.find((chain) => chain.id === Number(chainName) || chain.name.toLowerCase() === chainName.toLowerCase())
		: null

	const validAddress = typeof address === 'string' && address.length === 42 ? address : null

	if (!chainDetails || !validAddress) {
		return { notFound: true }
	}

	const queryClient = new QueryClient()

	await queryClient.prefetchQuery(['allPools', chainDetails.id, address, null, false], () =>
		getAllPools({
			chainId: chainDetails.id,
			collectionAddress: address
		})
	)

	return {
		props: {
			dehydratedState: dehydrate(queryClient),
			chainId: chainDetails.id,
			chainName: chainDetails.name,
			collectionAddress: address
		},
		revalidate: 120
	}
}
