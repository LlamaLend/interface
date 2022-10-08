import Head from 'next/head'
import Link from 'next/link'
import { RepayNftPlaceholder } from '~/components/GridItem/Repay'
import GridWrapper from '~/components/GridWrapper'
import Layout from '~/components/Layout'
import { chainConfig } from '~/lib/constants'
import useGetLoans from '~/queries/useLoans'

interface ILoansContainerProps {
	chainId?: number | null
	chainName?: string | null
	userAddress?: string
}

export default function LoansContainer({ chainId, chainName, userAddress }: ILoansContainerProps) {
	const { data, isLoading, isError } = useGetLoans({ chainId, userAddress })

	const chainSymbol = chainConfig(chainId).nativeCurrency?.symbol

	console.log({ data })

	return (
		<>
			<Head>
				<title>Repay - LlamaLend</title>
			</Head>

			<Layout>
				{!chainId || !chainName ? (
					<p className="fallback-text">Network not supported.</p>
				) : isError ? (
					<p className="fallback-text">Something went wrong, couldn't get loans.</p>
				) : isLoading ? (
					<GridWrapper className="mx-0 mt-8 mb-auto sm:my-9">
						{new Array(10).fill(1).map((_, index) => (
							<RepayNftPlaceholder key={'plitem' + index} />
						))}
					</GridWrapper>
				) : data.length === 0 ? (
					<p className="fallback-text">
						You don't have any loans, Click <Link href="/">here</Link> to borrow {chainSymbol}.
					</p>
				) : (
					<GridWrapper className="mx-0 mt-8 mb-auto sm:my-9">
						{new Array(10).fill(1).map((_, index) => (
							<RepayNftPlaceholder key={'plitem' + index} />
						))}
					</GridWrapper>
				)}
			</Layout>
		</>
	)
}
