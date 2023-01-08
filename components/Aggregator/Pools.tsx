import { useGetAggregatedPools } from '~/queries/useGetAggregatedPools'

export function AggregatedPools({ selectedCollection }: { selectedCollection?: string }) {
	const { data: pools, isLoading: fetchingPools } = useGetAggregatedPools({ collectionAddress: selectedCollection })

	if (!fetchingPools && selectedCollection && (!pools || pools?.length === 0)) {
		return (
			<p className="mt-[10%] text-center text-white text-opacity-60">Couldn't find lending pools of this collection</p>
		)
	}

	console.log({ pools })

	return <></>
}
