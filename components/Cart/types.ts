import type { IBorrowPool, INftItem } from '~/types'

export interface IBorrowCartProps {
	poolData?: IBorrowPool | null
	nftsList?: Array<INftItem> | null
	chainId?: number | null
	collectionAddress?: string
	isLoading: boolean
}

export interface IBorrowItemsProps {
	poolData: IBorrowPool
	nftsList: Array<INftItem>
	chainId: number
	collectionAddress: string
}

export interface IRepayCartProps {
	chainId?: number | null
	userAddress?: string
	isLoading: boolean
}

export interface IRepayItemProps {
	chainId: number
	userAddress?: string
}
