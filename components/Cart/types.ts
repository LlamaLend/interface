export interface IBorrowCartProps {
	poolAddress?: string | null
	chainId?: number | null
	collectionAddress?: string
	isLoading: boolean
}

export interface IBorrowItemsProps {
	poolAddress: string
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
