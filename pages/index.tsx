import type { NextPage } from 'next'
import Head from 'next/head'
import Layout from '~/components/Layout'
import { useGetAllPools } from '~/hooks/useGetAllPools'

const Home: NextPage = () => {
	const { data } = useGetAllPools()

	return (
		<div>
			<Head>
				<title>Borrow - LlamaLend</title>
			</Head>

			<Layout></Layout>
		</div>
	)
}

export default Home
