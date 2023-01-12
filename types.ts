import { ContractInterface, providers, Signer } from 'ethers'

export type Provider = providers.BaseProvider

export interface ITransactionSuccess {
	hash: string
	wait: () => Promise<{
		status?: number | undefined
		events: Array<{ address: string }>
	}>
}

export interface ITransactionError {
	message: string
}

export interface IContractReadConfig {
	address: string
	abi: ContractInterface
	provider: Provider
}

export interface IContractWriteConfig {
	address: string
	abi: ContractInterface
	signer: Signer | null
}

export interface INftApiResponse {
	ownedNfts: {
		id: {
			tokenId: string
		}
		metadata: {
			image: string
		}
		media: { gateway: string }[]
	}[]
}

export interface INftItem {
	tokenId: number
	imgUrl: string
}

export interface IOracleResponse {
	deadline: number
	normalizedNftContract: string
	price: string
	signature: {
		r: string
		s: string
		v: number
	}
}

export interface IBorrowPool {
	name: string
	symbol: string
	address: string
	maxLoanLength: number
	ltv: string
	nftContract: string
	collectionName: string
	poolBalance: string
	totalBorrowed: string
	totalDeposited: string
	maxVariableInterestPerEthPerSecond: string
	owner: string
	pricePerNft: string
	maxNftsToBorrow: string
	currentAnnualInterest: string
	oracle: string
	oraclePrice?: string
	maxPrice: number
	maxInstantBorrow: number
	dailyBorrows: number
	maxDailyBorrows: number
	adminPoolInfo: {
		key: string
		maxLoanLength: number
		minimumInterest: string
		maximumInterest: string
		liquidators: Array<string>
	}
}

export interface IBorrowPoolData {
	name: string
	symbol: string
	maxLoanLength: string
	currentAnnualInterest: string
	maxVariableInterestPerEthPerSecond: string
	ltv: string
	nftContract: string
	collectionName: string
	owner: string
	pricePerNft: string
	maxNftsToBorrow: string
}

export interface IGetAdminPoolDataArgs {
	poolAddress: string
	nftContractAddress: string
	provider: Provider
	graphEndpoint: string
}

export interface ILoan {
	id: string
	loanId: number | string
	nftId: string
	interest: string
	startTime: string
	borrowed: string
	toPay: {
		initialBorrowed: number
		apr: number
		interestAccrued: number
		lateFees: number
		total: number
		buffer: string
		totalPayable: string
	}
	deadline: number
	imgUrl: string
	owner: string
	pool: {
		name: string
		owner: string
		address: string
	}
}

export interface ILoanValidity {
	poolAddress: string
	loanId: number | string
	provider: Provider
	poolABI: ContractInterface
}

export interface ICollection {
	address: string
	name: string
	totalDeposited: string
	imgUrl: string
	sortIndex: number
}

export interface IArcadeQuote {
	borrowableToken: string
	principal: string
	interestRate: string
	loanDuration: string
	offerDeadline: number
	loanInstallments: string
	offerTimestamp: number
	loanUrl: string
}

export interface IBendDaoQuote {
	floorInEth: string
	borrowableToken: string
	currentVariableBorrowRate: string
	availableBorrow: string
	ltv: string
	liquidationThreshold: string
	loanUrl: string
}

export interface IJpegdQuote {
	vaultName: string
	floorInEth: string
	pToken: string
	credit: string
	liquidationLimit: string
	loanUrl: string
}

export interface INFTFiQuote {
	token: string
	principal: string
	repayment: string
	duration: string
	expiry: string
	interest: string
	url: string
}

export interface IX2Y2Quote {
	token: string
	amount: string
	repayment: string
	apr: string
	expires: string
	adminFee: string
	duration: string
	url: string
}

export interface ILlamaLendQuote {
	pricePerNft: string
	maxLoanLength: number
	currentAnnualInterest: string
	url: string
}
