import Head from 'next/head'
import Link from 'next/link'
import { PoolItem } from '~/components/GridItem'
import { PlaceHolderPoolItem } from '~/components/GridItem/Pool'
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
				{!chainId || !chainName ? (
					<p className="fallback-text">Network not supported. No pools on {chainName || 'this network'}.</p>
				) : isError ? (
					<p className="fallback-text">Something went wrong, couldn't get pools on this network.</p>
				) : isLoading ? (
					<GridWrapper>
						{new Array(10).fill(1).map((_, index) => (
							<PlaceHolderPoolItem key={'plitem' + index} />
						))}
					</GridWrapper>
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
							<PoolItem key={item.address} data={item} chainName={chainName} />
						))}
					</GridWrapper>
				)}
			</Layout>
		</>
	)
}

export default PoolsContainer
