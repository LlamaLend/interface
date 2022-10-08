import type { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { allChains, useNetwork } from 'wagmi'
import PoolsContainer from '~/containers/PoolsContainer'

interface IPageProps {
	chainId?: number
	chainName?: string
}

const PoolsByChain: NextPage<IPageProps> = ({ chainId, chainName }) => {
	const router = useRouter()
	const { chain } = useNetwork()

	const isDefaultRoute = router.asPath === '/pools'

	// only show pools of network user is connected to if they are on /pools, as /pools is similare index route i.e., '/'
	return (
		<PoolsContainer
			chainId={chainId || (isDefaultRoute ? chain?.id ?? 1 : null)}
			chainName={chainName || (isDefaultRoute ? chain?.name ?? 'Ethereum' : null)}
		/>
	)
}

export default PoolsByChain

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
	res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=59')

	const chainParam = query.chain?.[0] ?? null

	const chainDetails = chainParam
		? allChains.find(
				(chain) => chain.id === Number(chainParam) || chain.name.toLowerCase() === chainParam.toLowerCase()
		  )
		: null

	if (!chainDetails) {
		return {
			props: {}
		}
	}

	// const config = chainConfig(chainDetails.id)

	// const queryClient = new QueryClient()

	// await queryClient.prefetchQuery(['allPools', chainDetails.id], () =>
	// 	getAllpools({
	// 		chainId: chainDetails.id,
	// 		contractArgs: {
	// 			address: config.factoryAddress,
	// 			abi: config.factoryABI,
	// 			poolAbi: config.poolABI,
	// 			provider: config.chainProvider
	// 		}
	// 	})
	// )

	return { props: { chainId: chainDetails.id, chainName: chainDetails.name } }
}
