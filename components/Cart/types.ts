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

export interface IRepayCartProps {
	chainId?: number
	loanPoolAddress?: string
	loanPoolName?: string
	isLoading: boolean
}

export interface IRepayItemProps {
	chainId: number
	loanPoolAddress: string
	loanPoolName: string
}
