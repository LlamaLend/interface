import * as React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import * as dayjs from 'dayjs'
import * as relativeTime from 'dayjs/plugin/relativeTime'
import type { IBorrowPool } from '~/types'
import { formatDailyInterest } from '~/utils'
import pools from '~/lib/pools'
import { chainConfig } from '~/lib/constants'

// @ts-ignore
dayjs.extend(relativeTime)

interface IBorrowPoolItemProps {
	data: IBorrowPool
	chainId?: number | null
	chainName: string
}

export function BorrowPoolItem({ data, chainId, chainName }: IBorrowPoolItemProps) {
	const poolDeployer = pools[chainId || 1]?.find(
		(pool) => pool.poolAddress.toLowerCase() === data.address.toLowerCase()
	)?.ownerName

	const config = chainConfig(chainId)

	const router = useRouter()

	return (
		<div className="flex flex-wrap gap-14 rounded-xl bg-[#22242A] p-5">
			<div className="flex gap-2">
				<Image src="/assets/ethereum.png" height={40} width={40} className="rounded object-contain" alt="ethereum" />
				<div>
					<p className="data-[isfetching=true]:placeholder-box min-h-[1.5rem] font-semibold data-[isfetching=true]:w-20">
						{data?.pricePerNft ?? ''}
					</p>
					<p className="text-sm font-normal text-[#D4D4D8]">Loan Amount</p>
				</div>
			</div>

			<div>
				<p className="min-h-[1.5rem] font-semibold">
					{/* @ts-ignore */}
					{dayjs(new Date(new Date().getTime() + data.maxLoanLength * 1000)).toNow(true)}
				</p>
				<p className="text-sm font-normal text-[#D4D4D8]">Max Duration</p>
			</div>
			<div>
				<p className="data-[isfetching=true]:placeholder-box min-h-[1.5rem] font-semibold data-[isfetching=true]:w-20">
					{`${formatDailyInterest(data.currentAnnualInterest)}%`}
				</p>
				<p className="text-sm font-normal text-[#D4D4D8]">Daily Interest</p>
			</div>
			<div>
				<p className="data-[isfetching=true]:placeholder-box min-h-[1.5rem] font-semibold data-[isfetching=true]:w-20">
					{data.maxNftsToBorrow}
				</p>
				<p className="text-sm font-normal text-[#D4D4D8]">Borrowable Now</p>
			</div>
			<div>
				<a
					target="_blank"
					rel="noreferrer noopener"
					href={`${config.blockExplorer.url}/address/${data.address}`}
					className="min-h-[1.5rem] font-semibold text-[#3070FB]"
				>
					{data.name + (poolDeployer ? ` by ${poolDeployer}` : '')}
				</a>

				<p className="text-sm font-normal text-[#D4D4D8]">Pool Info</p>
			</div>

			<button
				className="ml-auto rounded-md bg-[#3046FB] px-4 py-[0.625rem] font-semibold"
				onClick={() => router.push(`/borrow/${chainName}/${data.address}`)}
			>
				Select Loan
			</button>
		</div>
	)
}

export function PlaceholderBorrowPoolItem() {
	return (
		<div className="flex flex-wrap gap-14 rounded-xl bg-[#22242A] p-5">
			<div className="flex gap-2">
				<Image src="/assets/ethereum.png" height={40} width={40} className="rounded object-contain" alt="ethereum" />
				<div>
					<p className="placeholder-box-2 h-[1.5rem] w-20 font-semibold"></p>
					<p className="text-sm font-normal text-[#D4D4D8]">Loan Amount</p>
				</div>
			</div>

			<div>
				<p className="placeholder-box-2 h-[1.5rem] w-20 font-semibold"></p>
				<p className="text-sm font-normal text-[#D4D4D8]">Max Duration</p>
			</div>
			<div>
				<p className="placeholder-box-2 h-[1.5rem] w-20 font-semibold"></p>
				<p className="text-sm font-normal text-[#D4D4D8]">Daily Interest</p>
			</div>
			<div>
				<p className="placeholder-box-2 h-[1.5rem] w-20 font-semibold"></p>
				<p className="text-sm font-normal text-[#D4D4D8]">Borrowable Now</p>
			</div>
			<div>
				<p className="placeholder-box-2 h-[1.5rem] w-16 font-semibold text-[#3070FB]"></p>
				<p className="text-sm font-normal text-[#D4D4D8]">Pool Info</p>
			</div>

			<button className="ml-auto rounded-md bg-[#3046FB] px-4 py-[0.625rem] font-semibold" disabled>
				Select Loan
			</button>
		</div>
	)
}
