import { useBalance } from 'wagmi'
import { useGetQuote } from './useGetQuote'

export default function usePoolBalance(poolAddress?: string) {
	// query to get quotation from server
	const { data: quote, isLoading: fetchingQuote, isError: errorFetchingQuote } = useGetQuote(poolAddress)

	const {
		data: contractBalance,
		error: errorFetchingContractBalance,
		isLoading: fetchingContractBalance
	} = useBalance({
		addressOrName: poolAddress,
		enabled: poolAddress ? true : false
	})

	const maxNftsToBorrow = (
		contractBalance && quote?.price ? Number(contractBalance.formatted) / quote.price : 0
	).toFixed(0)

	return {
		contractBalance,
		maxNftsToBorrow,
		quote,
		errorFetchingContractBalance,
		fetchingContractBalance,
		fetchingQuote,
		errorFetchingQuote
	}
}
