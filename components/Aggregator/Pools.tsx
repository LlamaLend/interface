import { useGetAggregatedPools } from '~/queries/useGetAggregatedPools'

export function AggregatedPools({ selectedCollection }: { selectedCollection?: string }) {
	const { data: pools, isLoading: fetchingPools } = useGetAggregatedPools({ collectionAddress: selectedCollection })

	return <></>
}
