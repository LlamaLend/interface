import type { NextPage } from 'next'
import Head from 'next/head'
import Layout from '~/components/Layout'

const Home: NextPage = () => {
	return (
		<div>
			<Head>
				<title>LlamaLend</title>
			</Head>

			<Layout>
				<h1 className="text-3xl font-bold underline">LlamaLend</h1>
			</Layout>
		</div>
	)
}

export default Home
