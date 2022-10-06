import { useQuery } from '@tanstack/react-query'
import { useNetwork } from 'wagmi'
import { chainConfig } from '~/lib/constants'
import { IQuoteResponse, ITransactionError } from '~/types'

interface IFetchQuoteProps {
	api: string
	poolAddress?: string
	isTestnet?: boolean
}

async function fetchQuote({ api, poolAddress, isTestnet }: IFetchQuoteProps): Promise<IQuoteResponse | null> {
	try {
		if (!poolAddress || isTestnet) {
			return null
		}

		const res = await fetch(`${api}/pool/${poolAddress}`).then((res) => res.json())

		const price = Number(res.price)

		return { ...res, price: !Number.isNaN(price) ? price / 1e18 : null }
	} catch (error: any) {
		throw new Error(error.message || (error?.reason ?? "Couldn't fetch quote"))
	}
}

const useGetQuote = (poolAddress?: string) => {
	const { chain } = useNetwork()
	const config = chainConfig(chain?.id)

	return useQuery<IQuoteResponse | null, ITransactionError>(
		['quote', chain?.id, poolAddress],
		() => fetchQuote({ api: config.quoteApi, poolAddress, isTestnet: chain?.testnet }),
		{
			refetchInterval: 30_000
		}
	)
}

export { useGetQuote, fetchQuote }
