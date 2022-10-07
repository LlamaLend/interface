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
		if (!poolAddress) {
			return null
		}

		if (isTestnet) {
			return {
				price: 0.01,
				deadline: 1667412882,
				normalizedNftContract: '0xf5de760f2e916647fd766b4ad9e85ff943ce3a2b',
				signature: {
					v: 28,
					r: '0x40a27297766795cb53185f61ccd6b9f3e5355d90b935f7f3e294c2554491c08d',
					s: '0x001174520775424c98a6ecb08cb148e872b5a38ed968e48ac37c19fcc7207dd3'
				}
			}
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
