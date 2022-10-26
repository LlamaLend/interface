import type { NextPage } from 'next'
import Head from 'next/head'
import { useAccount, useNetwork } from 'wagmi'
import BeatLoader from '~/components/BeatLoader'
import Layout from '~/components/Layout'
import { useShutdownAllPools } from '~/queries/admin/useEmergencyShutdown'

const ManagePools: NextPage = () => {
	const { isConnected } = useAccount()
	const { chain } = useNetwork()

	const { write: emergencyShutdown, isLoading: approvingShutdown } = useShutdownAllPools()

	return (
		<>
			<Head>
				<title>Shutdown Pools - LlamaLend</title>
			</Head>

			<Layout>
				<button
					className="mx-auto mt-12 min-h-[2.5rem] w-[7.5rem] rounded-lg bg-[#243b55] p-2 text-center text-sm text-white disabled:cursor-not-allowed"
					disabled={!emergencyShutdown || chain?.unsupported || !isConnected}
					onClick={() => emergencyShutdown?.()}
				>
					{approvingShutdown ? <BeatLoader /> : 'Shutdown'}
				</button>
			</Layout>
		</>
	)
}

export default ManagePools
