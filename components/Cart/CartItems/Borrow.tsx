import * as React from 'react'
import Image from 'next/image'
import { useAccount, useNetwork } from 'wagmi'
import { useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import * as dayjs from 'dayjs'
import BeatLoader from '~/components/BeatLoader'
import { useGetCartItems, useSaveItemToCart } from '~/queries/useCart'
import type { IBorrowItemsProps } from '../types'
import { useGetOracle } from '~/queries/useGetOracle'
import { useBorrow } from '~/queries/useBorrow'
import { useGetContractApproval, useSetContractApproval } from '~/queries/useContractApproval'
import { formatErrorMsg } from './utils'
import { formatCurrentAnnualInterest, getTotalReceivedArg, formatDailyInterest } from '~/utils'
import { chainConfig } from '~/lib/constants'

export function BorrowItems({ poolData, nftsList, chainId, collectionAddress, fetchingNftsList }: IBorrowItemsProps) {
	const { isConnected } = useAccount()

	const { chain } = useNetwork()

	const config = chainConfig(chainId)

	const { openChainModal } = useChainModal()
	const { openConnectModal } = useConnectModal()

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
			<div className="flex flex-col lg:flex-row">
				<div className="bg-[#191B21] p-6 lg:flex-1">
					<h1 className="text-base font-semibold">You Deposit:</h1>

					<div className="mt-4 flex max-w-[312px] flex-nowrap gap-3 overflow-x-auto">
						{!isConnected ? (
							<p className="text-xs opacity-60">Connect wallet to view your NFTs from this collection.</p>
						) : chain?.unsupported ? (
							<p className="text-xs opacity-60">Switch network to view your NFTs from this collection.</p>
						) : !nftsList ? (
							<p className="text-xs opacity-60">Sorry, couldn't find your NFTs from this collection.</p>
						) : nftsList.length === 0 ? (
							<p className="text-xs opacity-60">You have 0 NFTs in this collection to use as collateral.</p>
						) : (
							<>
								{nftsList.map((nft) => {
									const isChecked = cartTokenIds.includes(nft.tokenId) ? true : false
									return (
										<label
											className="relative aspect-square h-[96px] w-[96px] rounded-lg border-2 border-transparent data-[checked=true]:border-[#336AF7]"
											data-checked={isChecked}
											key={'collateral' + nft.imgUrl + nft.tokenId}
										>
											<input
												type="checkbox"
												name={`#${nft.tokenId}`}
												className="absolute z-0 aspect-square h-[92px] w-[92px] rounded-lg !border-none !bg-none !outline-none !ring-0 !ring-offset-0"
												checked={isChecked}
												onClick={() => saveItemToCart({ tokenId: nft.tokenId, contractAddress: collectionAddress })}
											/>
											<Image
												src={nft.imgUrl}
												width={96}
												height={96}
												alt={nft.tokenId.toString()}
												className="relative z-10 aspect-square rounded-lg"
											/>
											{isChecked && (
												<div className="absolute top-1.5 right-1.5 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-[#336AF7]">
													<svg
														width="12"
														height="10"
														viewBox="0 0 12 10"
														fill="none"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path d="M1 4.81818L4.125 8L11 1" stroke="white" stroke-width="2" />
													</svg>
												</div>
											)}
										</label>
									)
								})}
							</>
						)}
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
							<span className="text-white">{cartTokenIds.length}</span>
						</p>
						<p className="flex justify-between gap-4">
							<span>Total {chainSymbol}</span>
							<span className="text-white">
								{cartItemsList && oracle && poolData && cartItemsList?.length > 0
									? (Number(totalReceived) / 1e18).toFixed(4)
									: 0}
							</span>
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

					{/* Show error message of txs/queries initiated with wallet */}
					{errorMsgOfEthersQueries && !errorMsgOfEthersQueries.startsWith('user rejected transaction') && (
						<p className="mt-5 text-center text-xs text-[#ff9393]">
							{errorMsgOfEthersQueries.slice(0, 150)}
							{errorMsgOfEthersQueries.length > 150 ? '...' : ''}
						</p>
					)}

					{errorMsgOfQueries && <p className="mt-5 text-center text-xs text-[#ff9393]">{errorMsgOfQueries}</p>}

					{isLoading || fetchingNftsList ? (
						<Button disabled>
							<BeatLoader />
						</Button>
					) : !isConnected ? (
						<Button onClick={openConnectModal}>Connect Wallet</Button>
					) : isUserOnDifferentChain ? (
						<Button onClick={openChainModal}>Switch Network</Button>
					) : !nftsList || nftsList.length === 0 ? (
						<></>
					) : isApproved ? (
						cartTokenIds.length === 0 ? (
							<Button disabled>Select items to deposit</Button>
						) : canUserBorrowETH ? (
							<Button
								onClick={() => borrowETH?.()}
								disabled={!borrowETH || mutationDisabled || errorMsgOfQueries ? true : false}
							>
								Confirm Borrow
							</Button>
						) : (
							<>
								<Button disabled={true}>Borrow limit reached</Button>
								<p className="mt-2 text-center text-xs">Try removing some items from your cart</p>
							</>
						)
					) : (
						<Button onClick={() => approveContract?.()} disabled={!approveContract || errorMsgOfQueries ? true : false}>
							Approve Loans
						</Button>
					)}
				</div>
			</div>
		</>
	)
}

const Button = ({
	onClick,
	children,
	disabled
}: {
	children: React.ReactNode
	onClick?: () => void
	disabled?: boolean
}) => {
	return (
		<button
			className="mt-5 min-h-[40px] w-full rounded-lg bg-[#3046FB] p-2 text-sm font-semibold shadow disabled:cursor-not-allowed disabled:text-gray-400"
			onClick={onClick}
			disabled={disabled}
		>
			{children}
		</button>
	)
}
