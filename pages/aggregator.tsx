import type { NextPage } from 'next'
import { ethers } from 'ethers'
import { useMemo } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Layout from '~/components/Layout'
import { getArcadeCollections } from '~/AggregatorAdapters/arcade'
import { getBendDaoCollections } from '~/AggregatorAdapters/benddao'
import { getJpegdCollections } from '~/AggregatorAdapters/jpegd'
import { getNftFiCollections } from '~/AggregatorAdapters/nftfi'
import { getX2y2Collections } from '~/AggregatorAdapters/x2y2'
import { ERC721_ABI } from '~/lib/erc721.abi'
import { chainConfig } from '~/lib/constants'
import { AggregatorCollectionsSelect } from '~/components/Aggregator/CollectionsSelect'
import { AggregatedAdapters } from '~/components/Aggregator/Adapters'

interface IPageProps {
	collections: Array<{ address: string; name: string }>
}

const { chainProvider } = chainConfig(1)

async function getCollectionName(address: string) {
	const nftContract = new ethers.Contract(address, ERC721_ABI, chainProvider)

	const name = await nftContract.name()

	return { address: address.toLowerCase(), name }
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

const Aggregator: NextPage<IPageProps> = ({ collections }) => {
	const router = useRouter()

	const { collection } = router.query

	const { collectionAddress, collectionName } = useMemo(() => {
		const selectedCollection = typeof collection === 'string' ? collection.toLowerCase() : undefined

		return {
			collectionAddress: selectedCollection,
			collectionName: selectedCollection
				? collections.find((col) => col.address === selectedCollection)?.name ?? null
				: null
		}
	}, [collection, collections])

	return (
		<>
			<Head>
				<title>Aggregator - LlamaLend</title>
			</Head>

			<Layout className="pb-20">
				{router.isReady && (
					<AggregatorCollectionsSelect
						collectionAddress={collectionAddress}
						collectionName={collectionName}
						collections={collections}
					/>
				)}
				<AggregatedAdapters collectionAddress={collectionAddress} collectionName={collectionName} />
			</Layout>
		</>
	)
}

export default Aggregator
