export interface IBorrowCartProps {
	poolAddress?: string
	chainId?: number
	nftContractAddress?: string
	nftCollectionName?: string
	isLoading: boolean
}

export interface IBorrowItemsProps {
	poolAddress: string
	chainId: number
	nftContractAddress: string
	nftCollectionName: string
}
