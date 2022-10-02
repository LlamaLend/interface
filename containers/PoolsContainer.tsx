import Head from 'next/head'
import Link from 'next/link'
import { PoolItem } from '~/components/GridItem'
import GridWrapper from '~/components/GridWrapper'
import Layout from '~/components/Layout'
import { useGetAllPools } from '~/hooks/useGetAllPools'

interface IPoolsContainerProps {
	chainId?: number | null
	chainName?: string | null
}

const PoolsContainer = ({ chainId, chainName }: IPoolsContainerProps) => {
	const { data, isError, isLoading } = useGetAllPools({ chainId })

	return (
		<>
			<Head>
				<title>Borrow - LlamaLend</title>
			</Head>

			<Layout>
				{!chainId ? (
					<p className="fallback-text">Network not supported. No pools on {chainName || 'this network'}.</p>
				) : isError ? (
					<p className="fallback-text">Something went wrong, couldn't get pools on this network.</p>
				) : isLoading ? (
					<></>
				) : data.length === 0 ? (
					<p className="fallback-text">
						There are no pools on {chainName || 'this'} network. Click{' '}
						<Link href="/manage-pools">
							<a className="underline">here</a>
						</Link>{' '}
						to create a new pool.
					</p>
				) : (
					<GridWrapper>
						{data.map((item) => (
							<PoolItem key={item.address} data={item} />
						))}
					</GridWrapper>
				)}
			</Layout>
		</>
	)
}

export default PoolsContainer
