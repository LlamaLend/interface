import { useConnectModal } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import AdminPool from '~/components/AdminPool'
import Layout from '~/components/Layout'
import { useGetAllPools } from '~/queries/useGetAllPools'

interface IManagePoolsContainer {
	chainId?: number | null
	chainName?: string | null
	userAddress?: string
}

export default function ManagePoolsContainer({ chainId, chainName, userAddress }: IManagePoolsContainer) {
	const { isConnected, address } = useAccount()

	const { openConnectModal } = useConnectModal()

	const { data, isError } = useGetAllPools({ chainId, ownerAddress: userAddress })

	const disableActions = !isConnected || address?.toLowerCase() !== userAddress?.toLowerCase()

	return (
		<Layout>
			{!chainId || !chainName ? (
				<p className="fallback-text">Network not supported.</p>
			) : !userAddress ? (
				<p className="fallback-text">
					<button onClick={openConnectModal}>Connect</button> your wallet to view pools.
				</p>
			) : isError ? (
				<p className="fallback-text">Something went wrong, couldn't get loans.</p>
			) : data?.length === 0 ? (
				<p className="fallback-text">
					You don't have any pools, Click{' '}
					<Link href="/create">
						<a className="underline">here</a>
					</Link>{' '}
					to create a pool.
				</p>
			) : (
				<div className="my-8 flex w-full flex-col items-center justify-center gap-8">
					{data?.map((pool) => (
						<AdminPool
							data={pool}
							key={JSON.stringify(pool)}
							chainId={chainId}
							userAddress={userAddress}
							disableActions={disableActions}
						/>
					))}
				</div>
			)}
		</Layout>
	)
}
