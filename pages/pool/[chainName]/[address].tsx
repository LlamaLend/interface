import type { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import { allChains } from 'wagmi'
import { PlaceHolderItem } from '~/components/GridItem/Pool'
import GridWrapper from '~/components/GridWrapper'
import Layout from '~/components/Layout'
import { useGetPoolData } from '~/hooks/useGetPoolData'

interface IPageProps {
	chainId?: number
	chainName?: string
	address?: string
}

const PoolByChain: NextPage<IPageProps> = ({ chainId, chainName, address }) => {
	const { data, isLoading, isError } = useGetPoolData({ chainId, address })

	return (
		<Layout>
			{!chainId || !chainName ? (
				<p className="fallback-text">Network not supported, couldn't find pool info on this chain.</p>
			) : !address ? (
				<p className="fallback-text">Invalid address detected, please check address validity.</p>
			) : isError ? (
				<p className="fallback-text">Something went wrong, couldn't find data of this pool.</p>
			) : isLoading ? (
				<GridWrapper>
					{new Array(10).fill(1).map((_, index) => (
						<PlaceHolderItem key={'plitem' + index} />
					))}
				</GridWrapper>
			) : !data ? (
				<p className="fallback-text">
					There are no pools on {chainName || 'this'} network. Click{' '}
					<Link href="/manage-pools">
						<a className="underline">here</a>
					</Link>{' '}
					to create a new pool.
				</p>
			) : (
				<GridWrapper>
					<></>
				</GridWrapper>
			)}
		</Layout>
	)
}

export default PoolByChain

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const chainParam = typeof query.chainName === 'string' && query.chainName
	const address = typeof query.address === 'string' && query.address

	const chainDetails = chainParam
		? allChains.find(
				(chain) => chain.id === Number(chainParam) || chain.name.toLowerCase() === chainParam.toLowerCase()
		  )
		: null

	if (!chainDetails || !address) {
		return { props: {} }
	}

	const validAddress = address.length === 42 ? address : null

	// const config = chainConfig(chainDetails.id)

	// const queryClient = new QueryClient()

	// await queryClient.prefetchQuery(['pool', chainDetails.id, address], () =>
	// 	getPool({
	// 		chainId: chainDetails.id,
	// 		contractArgs: validAddress ? { address: validAddress, provider: config.chainProvider, abi: config.poolABI } : null
	// 	})
	// )

	return {
		props: { chainId: chainDetails.id, chainName: chainDetails.name, address: validAddress }
	}
}
