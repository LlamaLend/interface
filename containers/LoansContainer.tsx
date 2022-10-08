import Head from 'next/head'
import Layout from '~/components/Layout'
import useGetLoans from '~/queries/useLoans'

interface ILoansContainerProps {
	chainId?: number | null
	chainName?: string | null
	userAddress?: string
}

export default function LoansContainer({ chainId, userAddress }: ILoansContainerProps) {
	const { data } = useGetLoans({ chainId, userAddress })

	console.log({ data })

	return (
		<>
			<Head>
				<title>Repay - LlamaLend</title>
			</Head>

			<Layout></Layout>
		</>
	)
}
