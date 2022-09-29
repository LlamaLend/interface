import { ContractInterface, providers, Signer } from 'ethers'
import {} from 'wagmi'

type Provider = providers.BaseProvider

export interface ITransactionSuccess {
	hash: string
	wait: () => Promise<{
		status?: number | undefined
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
