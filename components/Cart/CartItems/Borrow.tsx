import * as React from 'react'
import Image from 'next/image'
import { useNetwork } from 'wagmi'
import { useChainModal } from '@rainbow-me/rainbowkit'
import * as dayjs from 'dayjs'
import BeatLoader from '~/components/BeatLoader'
import { useGetCartItems, useSaveItemToCart } from '~/queries/useCart'
import type { IBorrowItemsProps } from '../types'
import { useGetOracle } from '~/queries/useGetOracle'
import { useGetPoolInterestInCart } from '~/queries/useGetPoolData'
import { useBorrow } from '~/queries/useBorrow'
import { useGetContractApproval, useSetContractApproval } from '~/queries/useContractApproval'
import { formatErrorMsg } from './utils'
import { formatCurrentAnnualInterest, getTotalReceivedArg, getQuotePrice, formatDailyInterest } from '~/utils'
import { chainConfig } from '~/lib/constants'

export function BorrowItems({ poolData, nftsList, chainId, collectionAddress }: IBorrowItemsProps) {
	const { chain } = useNetwork()

	const config = chainConfig(chainId)

	const { openChainModal } = useChainModal()

	// check if user is on same network or else show switch network button and disable all write methods
	const isUserOnDifferentChain = chainId !== chain?.id

	// query to get cart items from local storage
	const {
		data: itemsInCart,
		isLoading: fetchingCartItems,
		isError: errorLoadingCartItems
	} = useGetCartItems({ contractAddress: collectionAddress, chainId })

	// query to get quotation from server
	const {
		data: oracle,
		isLoading: fetchingOracle,
		isError: errorFetchingOracle
	} = useGetOracle({ nftContractAddress: collectionAddress, chainId })

	// query to save/remove item to cart/localstorage
	const { mutate: saveItemToCart } = useSaveItemToCart({ chainId })

	const cartItemsList = nftsList?.filter((item) => itemsInCart?.includes(item.tokenId)) ?? []
	const cartTokenIds = cartItemsList?.map((item) => item.tokenId) ?? []

	// query to check approval of all tokens
	const {
		data: isApprovedForAll,
		isLoading: fetchingIfApproved,
		error: failedToFetchIfApproved
	} = useGetContractApproval({
		poolAddress: poolData.address,
		nftContractAddress: collectionAddress,
		enabled: isUserOnDifferentChain ? false : true
	})

	// query to set approval for all tokens
	const {
		write: approveContract,
		isLoading: approvingContract,
		error: errorApproving,
		waitForTransaction: {
			data: approvalTxOnChain,
			isLoading: checkingForApproveTxOnChain,
			error: txApproveErrorOnChain
		}
	} = useSetContractApproval({
		poolAddress: poolData.address,
		nftContractAddress: collectionAddress,
		enabled: isUserOnDifferentChain ? false : true
	})

	const isApproved = isApprovedForAll || approvalTxOnChain?.status === 1 ? true : false

	const totalReceived = getTotalReceivedArg({
		oraclePrice: oracle?.price ?? '0',
		noOfItems: cartTokenIds.length,
		ltv: poolData?.ltv ?? '0'
	})

	//query to borrow eth using nfts
	const {
		mutationDisabled,
		write: borrowETH,
		isLoading: userConfirmingBorrow,
		error: errorConfirmingBorrow,
		waitForTransaction: { data: borrowTxOnChain, isLoading: checkingForBorrowTxOnChain, error: txBorrowErrorOnChain }
	} = useBorrow({
		poolAddress: poolData.address,
		cartTokenIds,
		enabled: isApproved && oracle && poolData && !isUserOnDifferentChain ? true : false,
		maxInterest: poolData?.maxVariableInterestPerEthPerSecond,
		totalReceived,
		chainId
	})

	const { data: currentAPR } = useGetPoolInterestInCart({ poolAddress: poolData.address, totalReceived, chainId })
	const currentAnnualInterest = currentAPR?.toString()

	// construct error messages
	// Failed queries, but user can't retry with data of these queries
	const errorMsgOfQueries = errorLoadingCartItems
		? "Couldn't fetch items in your cart"
		: errorFetchingOracle
		? "Couldn't fetch price quotation"
		: null

	// Failed queries, but user can retry
	const errorMsgOfEthersQueries: string | null = failedToFetchIfApproved
		? failedToFetchIfApproved?.message
		: errorApproving
		? formatErrorMsg(errorApproving)
		: txApproveErrorOnChain
		? txApproveErrorOnChain?.message
		: approvalTxOnChain?.status === 0
		? 'Transaction failed, please try again'
		: errorConfirmingBorrow
		? formatErrorMsg(errorConfirmingBorrow)
		: txBorrowErrorOnChain
		? txBorrowErrorOnChain?.message
		: borrowTxOnChain?.status === 0
		? 'Transaction failed, please try again'
		: null

	// check all loading states to show beat loader
	const isLoading =
		fetchingCartItems ||
		fetchingOracle ||
		approvingContract ||
		checkingForApproveTxOnChain ||
		fetchingIfApproved ||
		userConfirmingBorrow ||
		checkingForBorrowTxOnChain

	const canUserBorrowETH = poolData ? Number(poolData.maxNftsToBorrow) > 0 : false

	const chainSymbol = config.nativeCurrency?.symbol ?? 'ETH'

	return (
		<>
			{errorMsgOfQueries ? (
				<p className="relative top-0 bottom-0 my-auto p-6 text-center text-sm text-[#ff9393]">{errorMsgOfQueries}</p>
			) : (
				<div className="flex flex-col lg:flex-row">
					<div className="bg-[#191B21] p-6 lg:flex-1">
						<h1 className="text-base font-semibold">You Deposit:</h1>

						<div className="mt-4 flex max-w-[312px] flex-nowrap gap-3 overflow-x-auto">
							{nftsList.map((nft) => (
								<Image
									key={'bcart' + nft.imgUrl}
									src={nft.imgUrl}
									width={96}
									height={96}
									alt={nft.tokenId.toString()}
									className="aspect-square rounded-lg"
								/>
							))}
						</div>

						<div className="mt-6 flex flex-col gap-3 text-sm text-[#9CA3AF]">
							<p className="flex justify-between gap-4">
								<span>Pool Name</span>
								<span>{poolData?.name}</span>
							</p>
							<p className="flex justify-between gap-4">
								<span>Pool Creator</span>
								<span>
									{poolData && (
										<a
											href={`${config.blockExplorer.url}/address/${poolData.owner}`}
											target="_blank"
											rel="noreferrer noopener"
											className="underline"
										>
											{poolData.owner.slice(0, 4) + '...' + poolData.owner.slice(-4)}
										</a>
									)}
								</span>
							</p>
							<p className="flex justify-between gap-4">
								<span>Oracle Contract</span>
								<span>
									{poolData && (
										<a
											href={`${config.blockExplorer.url}/address/${poolData.oracle}`}
											target="_blank"
											rel="noreferrer noopener"
											className="underline"
										>
											{poolData.oracle.slice(0, 4) + '...' + poolData.oracle.slice(-4)}
										</a>
									)}
								</span>
							</p>
							<p className="flex justify-between gap-4">
								<span>Current APR</span>
								<span>{poolData && `${formatCurrentAnnualInterest(poolData.currentAnnualInterest)}%`}</span>
							</p>
							<p className="flex justify-between gap-4">
								<span>Loan To Value</span>
								<span>{poolData && `${Number(poolData.ltv) / 1e16}%`}</span>
							</p>
							<p className="flex justify-between gap-4">
								<span>Loans Available</span>
								<span>{poolData?.maxNftsToBorrow}</span>
							</p>
							<p className="flex justify-between gap-4">
								<span>Pool Balance</span>
								<span>{poolData && `${(Number(poolData.poolBalance) / 1e18).toFixed(4)} ${chainSymbol}`}</span>
							</p>
						</div>
					</div>

					<div className="p-6 lg:flex-1">
						<h1 className="text-base font-semibold">You Receive:</h1>
						<div className="mt-6 flex flex-col gap-3 text-sm text-[#9CA3AF]">
							<p className="flex justify-between gap-4">
								<span>Loans</span>
								<span className="text-white"></span>
							</p>
							<p className="flex justify-between gap-4">
								<span>Total {chainSymbol}</span>
								<span className="text-white"></span>
							</p>
							<p className="flex justify-between gap-4">
								<span>Daily Interest</span>
								<span className="text-white">
									{poolData && `${formatDailyInterest(poolData.currentAnnualInterest)}%`}
								</span>
							</p>
							<p className="flex justify-between gap-4">
								<span>Repay Deadline</span>
								<span className="text-white">
									{/* @ts-ignore */}
									{poolData && dayjs(Date.now() + Number(poolData.maxLoanLength) * 1000).format('DD MMM YY')}
								</span>
							</p>
						</div>

						{/* These values are always truth as error and loading states are handled, but adding a check satisfy typescript compiler  */}
						{cartItemsList && oracle && cartItemsList?.length > 0 && oracle && (
							<ul className="flex flex-col gap-4">
								<li className="relative isolate flex items-center gap-1.5 rounded-xl text-sm font-medium">
									<span className="ml-auto flex gap-1.5">
										<Image
											src="/assets/ethereum.png"
											height={16}
											width={16}
											className="object-contain"
											alt="ethereum"
										/>
										{/* Show placeholder when fetching quotation */}
										{fetchingOracle ? (
											<span className="placeholder-box h-4 w-[4ch]" style={{ width: '4ch', height: '16px' }}></span>
										) : (
											<span>
												{(Number(totalReceived) / 1e18).toFixed(4)} {chainSymbol}
											</span>
										)}
									</span>
								</li>
							</ul>
						)}

						{/* Show error message of txs/queries initiated with wallet */}
						{errorMsgOfEthersQueries && !errorMsgOfEthersQueries.startsWith('user rejected transaction') && (
							<p className="mt-5 text-center text-sm text-[#ff9393]">
								{errorMsgOfEthersQueries.slice(0, 150)}
								{errorMsgOfEthersQueries.length > 150 ? '...' : ''}
							</p>
						)}

						{isLoading ? (
							<button
								className="mt-5 w-full rounded-lg bg-[#3046FB] p-2 text-sm font-semibold shadow disabled:cursor-not-allowed disabled:text-opacity-50"
								disabled
							>
								<BeatLoader />
							</button>
						) : isUserOnDifferentChain ? (
							<button
								className="mt-5 w-full rounded-lg bg-[#3046FB] p-2  text-sm font-semibold shadow disabled:cursor-not-allowed disabled:text-opacity-50"
								onClick={openChainModal}
							>
								Switch Network
							</button>
						) : isApproved ? (
							canUserBorrowETH ? (
								<button
									className="font-semiboldshadow mt-5 w-full rounded-lg bg-[#3046FB]  p-2  text-sm disabled:cursor-not-allowed disabled:text-opacity-50"
									onClick={() => borrowETH?.()}
									disabled={!borrowETH || mutationDisabled}
								>
									Confirm Borrow
								</button>
							) : (
								<>
									<button
										className="mt-5 w-full rounded-lg bg-[#3046FB] p-2  text-sm font-semibold shadow disabled:cursor-not-allowed disabled:text-opacity-50"
										data-not-allowed
										disabled={true}
									>
										Borrow limit reached
									</button>
									<p style={{ textAlign: 'center', fontSize: '0.8rem', marginTop: '-12px' }}>
										Try removing some items from your cart
									</p>
								</>
							)
						) : (
							<button
								className="mt-5 w-full rounded-lg bg-[#3046FB] p-2 text-sm font-semibold shadow disabled:cursor-not-allowed disabled:text-opacity-50"
								onClick={() => approveContract?.()}
								disabled={!approveContract || errorMsgOfQueries ? true : false}
							>
								Approve Loans
							</button>
						)}
					</div>
				</div>
			)}
		</>
	)
}
