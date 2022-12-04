import Head from 'next/head'
import { useState } from 'react'
import { BorrowCollectionItemCard, BorrowCollectionItemList } from '~/components/Collection'
import Layout from '~/components/Layout'
import { useGetAllCollections } from '~/queries/useGetAllCollections'
import { ICollection } from '~/types'

enum ViewType {
	Card,
	List,
}

interface ICollectionContainerProps {
	chainId: number
	chainName: string
}

const renderCollectionItem = ({ chainId, chainName }: ICollectionContainerProps, collections: ICollection[] | undefined, viewType: ViewType ) => (
	viewType === ViewType.Card ? (
		<ul className="mx-0 mt-8 mb-auto grid grid-cols-[repeat(auto-fit,minmax(240px,260px))] place-content-around gap-8 sm:my-9 2xl:place-content-between">
			{collections?.map((item) => (
				<BorrowCollectionItemCard key={item.address} data={item} chainName={chainName} />
			))}
		</ul>
	) : (
		<ul className="grid grid-rows-1">
			{collections?.map((item) => (
				<BorrowCollectionItemList key={item.address} data={item} chainId={chainId} chainName={chainName} />
			))}
		</ul>
	)
)

const ViewTypeSwitch = ({ viewType, onClick } : { viewType: ViewType, onClick: () => void }) => {
	return (
		<div className="flex items-center justify-end">
			<div className="inline-flex pb-2" role="group" onClick={onClick}>
				<button
					type="button"
					className={`rounded-l px-2 py-1 border-2 border-white font-medium text-xs ${viewType === ViewType.Card && "bg-white text-black"}`}
				>
					Grid
				</button>
				<button 
					type="button"
					className={`rounded-r px-2 py-1 border-2 border-white font-medium text-xs ${viewType === ViewType.List && "bg-white text-black"}`}
				>
					List
				</button>
			</div>
		</div>
	)
}

const CollectionsContainer = ({ chainId, chainName }: ICollectionContainerProps) => {
	const [viewType, setViewType] = useState<ViewType>(ViewType.Card)
	const { data: collections } = useGetAllCollections({ chainId, skipOracle: false })
	const toggleViewType = () => {
		viewType === ViewType.Card ? setViewType(ViewType.List) : setViewType(ViewType.Card)
	}
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
						<ViewTypeSwitch viewType={viewType} onClick={toggleViewType} />
						{renderCollectionItem({chainName, chainId}, collections, viewType)}
					</>
				)}
			</Layout>
		</>
	)
}

export default CollectionsContainer
