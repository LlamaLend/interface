import Head from 'next/head'
import { useRouter } from 'next/router'
import { BorrowCollectionItemCard, BorrowCollectionItemList } from '~/components/Collection'
import Layout from '~/components/Layout'
import { useGetAllCollections } from '~/queries/useGetAllCollections'
import { ICollection } from '~/types'

interface ICollectionContainerProps {
	chainId: number
	chainName: string
}

interface ICollections extends ICollectionContainerProps {
	data?: ICollection[]
}

const Collections = ({ chainId, chainName, data }: ICollections) => {
	const router = useRouter()

	const { view } = router.query

	const isListView = view === 'list'

	if (isListView) {
		return (
			<ul className="mb-9 flex flex-col overflow-x-auto rounded-xl bg-[#191919]">
				{data?.map((item) => (
					<BorrowCollectionItemList key={item.address} data={item} chainId={chainId} chainName={chainName} />
				))}
			</ul>
		)
	}

	return (
		<ul className="mx-0 mb-9 grid grid-cols-[repeat(auto-fit,minmax(240px,260px))] place-content-around gap-8 2xl:place-content-between">
			{data?.map((item) => (
				<BorrowCollectionItemCard key={item.address} data={item} chainName={chainName} />
			))}
		</ul>
	)
}

const ViewTypeSwitch = () => {
	const router = useRouter()

	const { view } = router.query

	const isListView = view === 'list'

	const handleClick = () =>
		router.push(
			{ pathname: router.pathname, query: { ...router.query, view: isListView ? 'card' : 'list' } },
			undefined,
			{ shallow: true }
		)

	return (
		<div className="mt-8 flex items-center justify-end">
			<div className="inline-flex pb-2" role="group">
				<button
					className={`rounded-l border-2 border-white px-2 py-1 text-xs font-medium ${
						!isListView && 'bg-white text-black'
					}`}
					onClick={handleClick}
				>
					Grid
				</button>
				<button
					className={`rounded-r border-2 border-white px-2 py-1 text-xs font-medium ${
						isListView && 'bg-white text-black'
					}`}
					onClick={handleClick}
				>
					List
				</button>
			</div>
		</div>
	)
}

const CollectionsContainer = ({ chainId, chainName }: ICollectionContainerProps) => {
	const { data: collections } = useGetAllCollections({ chainId, skipOracle: true })

	return (
		<>
			<Head>
				<title>Borrow - LlamaLend</title>
			</Head>

			<Layout>
				{!chainId || !chainName ? (
					<p className="fallback-text">Network not supported. No pools on {chainName || 'this network'}.</p>
				) : collections?.length === 0 ? (
					<p className="fallback-text">There are no collections on {chainName || 'this'} network.</p>
				) : (
					<>
						<ViewTypeSwitch />

						<Collections chainId={chainId} chainName={chainName} data={collections} />
					</>
				)}
			</Layout>
		</>
	)
}

export default CollectionsContainer
