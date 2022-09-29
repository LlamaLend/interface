export interface ITransactionSuccess {
	hash: string
	wait: () => Promise<{
		status?: number | undefined
	}>
}

export interface ITransactionError {
	message: string
}
