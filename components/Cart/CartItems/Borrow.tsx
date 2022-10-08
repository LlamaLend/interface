import * as React from 'react'
import Image from 'next/future/image'
import BeatLoader from '~/components/BeatLoader'
import ItemsPlaceholder from './Placeholder'
import { useGetNftsList } from '~/queries/useNftsList'
import { useGetCartItems, useSaveItemToCart } from '~/queries/useCart'
import type { IBorrowItemsProps } from '../types'
import { useGetQuote } from '~/queries/useGetQuote'
import { useGetPoolData, useGetPoolInterestInCart } from '~/queries/useGetPoolData'
import { useBorrow } from '~/queries/useBorrow'
import { useGetContractApproval, useSetContractApproval } from '~/queries/useContractApproval'
import usePoolBalance from '~/queries/usePoolBalance'

const formatErrorMsg = (error: any) => {
	if (error?.code === 'UNPREDICTABLE_GAS_LIMIT') {
		return 'Cannot estimate gas, Transaction may fail or may require manual gas limit.'
	} else return error.reason
}

export function BorrowItems({ poolAddress, chainId, nftContractAddress, nftCollectionName }: IBorrowItemsProps) {
	const { data: nftsList, isLoading: fetchingNftsList } = useGetNftsList(nftContractAddress)

	// query to get cart items from local storage
	const {
		data: itemsInCart,
		isLoading: fetchingCartItems,
		isError: errorLoadingCartItems
	} = useGetCartItems(nftContractAddress)

	// query to get quotation from server
	const { data: quote, isLoading: fetchingQuote, isError: errorFetchingQuote } = useGetQuote(poolAddress)

	// query to get interest rates
	const {
		data: poolData,
		isLoading: fetchingPoolData,
		isError: errorFetchingPoolData
	} = useGetPoolData({ chainId, poolAddress })

	// query to save/remove item to cart/localstorage
	const { mutate: saveItemToCart } = useSaveItemToCart()

	const cartItemsList = nftsList?.filter((item) => itemsInCart?.includes(item.tokenId)) ?? []
	const cartTokenIds = cartItemsList?.map((item) => item.tokenId) ?? []

	// query to check approval of all tokens
	const {
		data: isApprovedForAll,
		isLoading: fetchingIfApproved,
		error: failedToFetchIfApproved
	} = useGetContractApproval({ poolAddress, nftContractAddress })

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
	} = useSetContractApproval({ poolAddress, nftContractAddress })

	const isApproved = isApprovedForAll || approvalTxOnChain?.status === 1 ? true : false

	//query to borrow eth using nfts
	const {
		mutationDisabled,
		write: borrowETH,
		isLoading: userConfirmingBorrow,
		error: errorConfirmingBorrow,
		waitForTransaction: { data: borrowTxOnChain, isLoading: checkingForBorrowTxOnChain, error: txBorrowErrorOnChain }
	} = useBorrow({
		poolAddress,
		cartTokenIds,
		enabled: isApproved && quote && poolData ? true : false,
		maxInterest: poolData?.maxVariableInterestPerEthPerSecond
	})

	const { contractBalance, maxNftsToBorrow, errorFetchingContractBalance, fetchingContractBalance } =
		usePoolBalance(poolAddress)

	const totalReceived = quote?.price && cartItemsList.length ? cartItemsList.length * quote.price : 0

	const { data: currentAnnualInterest } = useGetPoolInterestInCart({ poolAddress, totalReceived: totalReceived })

	// construct error messages
	// Failed queries, but user can't retry with data of these queries
	const errorMsgOfQueries = errorLoadingCartItems
		? "Couldn't fetch items in your cart"
		: errorFetchingQuote
		? "Couldn't fetch price quotation"
		: errorFetchingPoolData
		? "Couldn't fetch interest rate"
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
		? errorConfirmingBorrow?.message
		: txBorrowErrorOnChain
		? txBorrowErrorOnChain?.message
		: borrowTxOnChain?.status === 0
		? 'Transaction failed, please try again'
		: errorFetchingContractBalance
		? errorFetchingContractBalance.message
		: null

	// check all loading states to show beat loader
	const isLoading =
		fetchingNftsList ||
		fetchingCartItems ||
		fetchingQuote ||
		fetchingPoolData ||
		approvingContract ||
		checkingForApproveTxOnChain ||
		fetchingIfApproved ||
		userConfirmingBorrow ||
		checkingForBorrowTxOnChain ||
		fetchingContractBalance

	const canUserBorrowETH =
		contractBalance && cartItemsList && quote?.price
			? Number((cartItemsList.length * quote.price).toFixed(2)) < Number(contractBalance.formatted)
			: false

	return (
		<>
			{errorMsgOfQueries ? (
				<p className="mt-5 mb-9 p-6 text-center text-sm text-[#ff9393] xl:mt-[60%]">{errorMsgOfQueries}</p>
			) : cartItemsList && cartItemsList.length <= 0 ? (
				<p className="mt-8 mb-9 p-6 text-center xl:mt-[60%]">Your cart is empty. Fill it with NFTs to borrow ETH.</p>
			) : (
				<>
					{/* Show placeholder when fetching items in cart */}
					{fetchingCartItems || fetchingNftsList ? (
						<ItemsPlaceholder />
					) : (
						<ul className="flex flex-col gap-4">
							{cartItemsList?.map(({ tokenId, imgUrl }) => (
								<li key={tokenId} className="relative isolate flex items-center gap-1.5 rounded-xl text-sm font-medium">
									<button
										className="absolute -top-2 -left-1.5 z-10 h-6 w-6 rounded-xl bg-white p-1 text-black transition-[1.125s_ease]"
										onClick={() => saveItemToCart({ tokenId, contractAddress: nftContractAddress })}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											strokeWidth={2}
										>
											<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
										</svg>
										<span className="sr-only">Remove Item from cart</span>
									</button>

									<Image
										src={imgUrl}
										width={40}
										height={40}
										className="rounded object-cover"
										alt={`token id ${tokenId}`}
									/>

									<span className="flex flex-col flex-wrap justify-between gap-1">
										<span>{`#${tokenId}`}</span>
										<span className="font-base text-[0.8rem] text-[#989898]">{nftCollectionName}</span>
									</span>

									<span className="ml-auto flex gap-1.5">
										<Image
											src="/assets/ethereum.png"
											height={16}
											width={16}
											className="object-contain"
											alt="ethereum"
										/>
										<span>{quote?.price?.toFixed(2)}</span>
									</span>
								</li>
							))}
						</ul>
					)}

					<hr className="border-[rgba(255,255,255,0.08)]" />

					<h2 className="-mt-1.5 -mb-3 text-sm font-medium">Loan Details</h2>

					{/* These values are always truth as error and loading states are handles, but adding a check satisfy typescript compiler  */}
					{cartItemsList && quote && cartItemsList?.length > 0 && quote?.price && (
						<ul className="flex flex-col gap-4">
							<li className="relative isolate flex items-center gap-1.5 rounded-xl text-sm font-medium">
								<span className="font-base text-[#989898]">You Receive</span>
								<span className="ml-auto flex gap-1.5">
									<Image src="/assets/ethereum.png" height={16} width={16} className="object-contain" alt="ethereum" />
									{/* Show placeholder when fetching quotation */}
									{fetchingQuote ? (
										<span className="placeholder-box h-4 w-[4ch]" style={{ width: '4ch', height: '16px' }}></span>
									) : (
										<span>{totalReceived.toFixed(2)} ETH</span>
									)}
								</span>
							</li>

							<li className="relative isolate flex items-center gap-1.5 rounded-xl text-sm font-medium">
								<span className="font-base text-[#989898]">Interest</span>
								<span className="ml-auto flex gap-1.5">
									{/* Show placeholder when fetching interest rates */}
									{fetchingPoolData ? (
										<span className="placeholder-box h-4 w-[7ch]" style={{ width: '7ch', height: '16px' }}></span>
									) : (
										<span>{currentAnnualInterest && `${(Number(currentAnnualInterest) / 1e16).toFixed(2)}% p.a.`}</span>
									)}
								</span>
							</li>

							<li className="relative isolate flex items-center gap-1.5 rounded-xl text-sm font-medium">
								<span className="font-base text-[#989898]">Deadline</span>
								<span className="ml-auto flex gap-1.5">
									{/* Show placeholder when fetching quotation */}
									{fetchingQuote ? (
										<span className="placeholder-box h-4 w-[7ch]" style={{ width: '7ch', height: '16px' }}></span>
									) : (
										<span>{new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleString()}</span>
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
							className="mt-5 rounded-lg bg-blue-500 p-2 shadow disabled:cursor-not-allowed disabled:text-opacity-50"
							disabled
						>
							<BeatLoader />
						</button>
					) : isApproved ? (
						canUserBorrowETH ? (
							<button
								className="mt-5 rounded-lg bg-blue-500 p-2 shadow disabled:cursor-not-allowed disabled:text-opacity-50"
								onClick={() => borrowETH?.()}
								disabled={!borrowETH || mutationDisabled}
							>
								Confirm Borrow
							</button>
						) : (
							<>
								<button
									className="mt-5 rounded-lg bg-blue-500 p-2 shadow disabled:cursor-not-allowed disabled:text-opacity-50"
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
							className="mt-5 rounded-lg bg-blue-500 p-2 shadow disabled:cursor-not-allowed disabled:text-opacity-50"
							onClick={() => approveContract?.()}
							disabled={!approveContract || errorMsgOfQueries ? true : false}
						>
							Approve
						</button>
					)}

					{contractBalance && quote?.price && (
						<p className="mt-auto flex items-center justify-center gap-[1ch] pt-10 text-center text-xs font-medium">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								width={16}
								height={16}
								className="flex-shrink-0"
							>
								<path
									fillRule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
									clipRule="evenodd"
								/>
							</svg>
							<span>{`Max ${nftCollectionName} to borrow against: ${maxNftsToBorrow}`}</span>
						</p>
					)}
				</>
			)}
		</>
	)
}
