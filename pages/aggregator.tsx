import Head from 'next/head'
import type { NextPage } from 'next'
import { ethers } from 'ethers'
import { Select, SelectArrow, SelectItem, SelectLabel, SelectPopover, useSelectState } from 'ariakit'
import Layout from '~/components/Layout'
import { getArcadeCollections } from '~/AggregatorAdapters/arcade'
import { getBendDaoCollections } from '~/AggregatorAdapters/benddao'
import { getJpegdCollections } from '~/AggregatorAdapters/jpegd'
import { getNftFiCollections } from '~/AggregatorAdapters/nftfi'
import { getX2y2Collections } from '~/AggregatorAdapters/x2y2'
import { ERC721_ABI } from '~/lib/erc721.abi'
import { chainConfig } from '~/lib/constants'
import { useRouter } from 'next/router'

interface IPageProps {
	collections: Array<{ address: string; name: string }>
}

const { chainProvider } = chainConfig(1)

async function getCollectionName(address: string) {
	const nftContract = new ethers.Contract(address, ERC721_ABI, chainProvider)

	const name = await nftContract.name()

	return { address, name }
}

export async function getStaticProps() {
	const res = await Promise.allSettled([
		getArcadeCollections(),
		getBendDaoCollections(),
		getJpegdCollections(),
		getNftFiCollections(),
		getX2y2Collections()
	])

	const collectionAddresses = new Set<string>()

	res.forEach((col) => {
		if (col.status === 'fulfilled') {
			col.value.forEach((address: string) => {
				collectionAddresses.add(address.toLowerCase())
			})
		}
	})

	const collections = await Promise.allSettled(
		Array.from(collectionAddresses).map((address) => getCollectionName(address))
	)

	return {
		props: {
			collections: collections.map((col) => (col.status === 'fulfilled' ? col.value : null)).filter((col) => !!col)
		},
		revalidate: 120
	}
}

function renderValue({ name, address }: { address: string; name: string }) {
	return (
		<>
			<img
				src={`https://icons.llamao.fi/icons/nfts/${address}?h=20&w=20`}
				alt=""
				aria-hidden
				className="h-5 w-5 rounded-full"
			/>
			<span className="overflow-hidden text-ellipsis whitespace-nowrap">{name}</span>
		</>
	)
}

const Aggregator: NextPage<IPageProps> = ({ collections }) => {
	const router = useRouter()

	const { collection } = router.query

	const selectedCollection = typeof collection === 'string' ? collection : undefined

	const select = useSelectState({
		value: selectedCollection,
		setValue: (newCol) =>
			router.push({ pathname: router.pathname, query: { ...router.query, collection: newCol } }, undefined, {
				shallow: true
			}),
		sameWidth: true,
		gutter: 4
	})

	const selectedCollectionName = selectedCollection
		? collections.find((col) => col.address.toLowerCase() === selectedCollection.toLowerCase())?.name ?? null
		: null

	return (
		<>
			<Head>
				<title>Aggregator - LlamaLend</title>
			</Head>

			<Layout>
				<div className="mx-auto mt-[5%] flex w-full max-w-lg flex-col gap-2 p-4">
					<SelectLabel state={select}>Collections</SelectLabel>
					<Select state={select} className="flex flex-nowrap items-center gap-2 rounded-md bg-[#484C50] px-4 py-2">
						<img
							src={`https://icons.llamao.fi/icons/nfts/${select.value}?h=20&w=20`}
							alt=""
							aria-hidden
							className="h-5 w-5 rounded-full"
						/>

						<span className="mr-auto overflow-hidden text-ellipsis whitespace-nowrap">
							{selectedCollectionName || select.value}
						</span>
						<SelectArrow />
					</Select>
					<a
						href={`https://etherscan.io/address/${select.value}`}
						target="_blank"
						rel="noopener noreferrer"
						className="text-xs text-white text-opacity-50"
					>
						{select.value}
					</a>
					<SelectPopover
						state={select}
						className="z-50 flex max-h-[min(var(--popover-available-height,300px),300px)] flex-col overflow-auto overscroll-contain rounded-md bg-[#484C50] py-2"
					>
						{collections.map((collection) => (
							<SelectItem
								key={collection.address}
								value={collection.address}
								className="flex cursor-pointer scroll-m-2 flex-nowrap items-center gap-2 px-4 py-2	data-[active-item]:bg-black data-[active-item]:bg-opacity-20"
							>
								{renderValue(collection)}
							</SelectItem>
						))}
					</SelectPopover>
				</div>
			</Layout>
		</>
	)
}

export default Aggregator
