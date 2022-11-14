import { useState } from 'react'
import { useDebounce } from '~/hooks'
import dynamic from 'next/dynamic'
import { cx } from 'cva'
import BeatLoader from '~/components/BeatLoader'
import type { IBorrowPool } from '~/types'
import { chainConfig } from '~/lib/constants'
import useUpdateLtv from '~/queries/admin/useChangeLtv'
import useSetMaxPrice from '~/queries/admin/useSetMaxPrice'
import useSetMaxDailyBorrows from '~/queries/admin/useSetMaxDailyBorrows'
import useDeposit from '~/queries/admin/useDeposit'
import useWithdraw from '~/queries/admin/useWithdraw'
import useEmergencyShutdown from '~/queries/admin/useEmergencyShutdown'
import useSetOracle from '~/queries/admin/useSetOracle'
import { IPoolUtilisationChartProps } from '~/components/Charts/PoolUtilisation'
import useChangeInterest from '~/queries/admin/useChangeInterest'
import { useAddLiquidator, useRemoveLiquidator } from '~/queries/admin/useLiquidator'
import { useGetPoolData } from '~/queries/useGetPoolData'

const PoolUtilisationChart = dynamic<IPoolUtilisationChartProps>(() => import('~/components/Charts/PoolUtilisation'), {
	ssr: false,
	loading: () => <div style={{ height: '360px' }}></div>
})

export default function AdminPool({
	data,
	chainId,
	userAddress,
	disableActions
}: {
	data: IBorrowPool
	chainId: number
	userAddress: string
	disableActions: boolean
}) {
	const config = chainConfig(chainId)

	const { data: poolAddlInfo, isLoading } = useGetPoolData({ chainId, poolAddress: data.address })

	const { maxPrice, maxDailyBorrows, oracle, minimumInterest, maximumInterest, liquidators } = data.adminPoolInfo

	const [ltv, setLtv] = useState<string>((data.ltv / 1e16).toFixed(0))

	const [newMaxPrice, setNewMaxPrice] = useState<string>(maxPrice ? (maxPrice / 1e18).toFixed(3) : '0')
	const [newOracle, setNewOracle] = useState<string>(oracle || '')
	const [liquidatorAddress, setLiquidatorAddress] = useState<string>('')

	const [newMaxDailyBorrows, setNewMaxDailyBorrows] = useState<string>(
		maxDailyBorrows ? (maxDailyBorrows / 1e18).toFixed(3) : ''
	)

	const [minInterest, setMinInterest] = useState<string>(minimumInterest.toString())
	const [maxInterest, setMaxInterest] = useState<string>(maximumInterest.toString())

	const debouncedMinInterest = useDebounce(!Number.isNaN(Number(minInterest)) ? Number(minInterest) : 0, 200)
	const debouncedMaxInterest = useDebounce(!Number.isNaN(Number(maxInterest)) ? Number(maxInterest) : 0, 200)

	const isInvalidInterests =
		minInterest === '' || maxInterest === '' ? true : debouncedMaxInterest < debouncedMinInterest

	const [amountToDeposit, setAmountToDeposit] = useState<string>('')
	const [amountToWithdraw, setAmountToWithdraw] = useState<string>('')

	const {
		write: updateLtv,
		isLoading: approvingLtvChange,
		waitForTransaction: { isLoading: confirmingLtvChange }
	} = useUpdateLtv({
		newLtv: ltv,
		chainId,
		userAddress,
		poolAddress: data.address
	})

	const {
		write: updateMaxPrice,
		isLoading: approvingMaxPriceChange,
		waitForTransaction: { isLoading: confirmingMaxPriceChange }
	} = useSetMaxPrice({
		newMaxPrice,
		chainId,
		userAddress,
		poolAddress: data.address
	})

	const {
		write: updateMaxDailyBorrows,
		isLoading: approvingDailyBorrowsChange,
		waitForTransaction: { isLoading: confirmingDailyBorrowsChange }
	} = useSetMaxDailyBorrows({
		newMaxDailyBorrows,
		chainId,
		userAddress,
		poolAddress: data.address
	})

	const {
		write: updateOracle,
		isLoading: approvingOracleChange,
		waitForTransaction: { isLoading: confirmingOracleChange }
	} = useSetOracle({
		newOracle,
		chainId,
		userAddress,
		poolAddress: data.address
	})

	const {
		write: updateInterest,
		isLoading: approvingInterestChange,
		waitForTransaction: { isLoading: confirmingInterestChange }
	} = useChangeInterest({
		maximumInterest: debouncedMaxInterest,
		minimumInterest: debouncedMinInterest,
		isInvalidInterests,
		chainId,
		userAddress,
		poolAddress: data.address
	})

	const {
		write: deposit,
		isLoading: approvingDeposit,
		waitForTransaction: { isLoading: confirmingDeposit }
	} = useDeposit({
		amountToDeposit,
		chainId,
		userAddress,
		poolAddress: data.address
	})

	const {
		write: withdraw,
		isLoading: approvingWithdraw,
		waitForTransaction: { isLoading: confirmingWithdraw }
	} = useWithdraw({
		amountToWithdraw,
		chainId,
		userAddress,
		poolAddress: data.address
	})

	const {
		write: addLiquidator,
		isLoading: approvingNewLiquidator,
		waitForTransaction: { isLoading: confirmingNewLiquidator }
	} = useAddLiquidator({
		liquidatorAddress,
		chainId,
		userAddress,
		poolAddress: data.address
	})

	const {
		write: emergencyShutdown,
		isLoading: approvingShutdown,
		waitForTransaction: { isLoading: confirmingShutdown }
	} = useEmergencyShutdown({
		chainId,
		userAddress,
		poolAddress: data.address
	})

	const chainSymbol = config.nativeCurrency?.symbol

	return (
		<div className="flex w-full max-w-2xl flex-col gap-6 rounded-xl bg-[#191919] p-4 shadow">
			<h1 className="text-xs font-light text-gray-400">Pool</h1>
			<p className="-my-6 text-lg">{`${data.name} (${data.symbol})`}</p>
			<a
				target="_blank"
				rel="noreferrer noopener"
				href={`${config.blockExplorer.url}/address/${data.address}`}
				className="w-fit break-all text-xs"
			>
				{data.address}
			</a>

			<h1 className="text-xs font-light text-gray-400">Collection</h1>
			<p className="-my-6 min-h-[1.75rem] text-lg">{data.collectionName}</p>
			<a
				target="_blank"
				rel="noreferrer noopener"
				href={`${config.blockExplorer.url}/address/${data.nftContract}`}
				className="w-fit break-all text-xs"
			>
				{data.nftContract}
			</a>

			<h1 className="text-xs font-light text-gray-400">Balance</h1>
			<p className="-mt-6 min-h-[1.5rem] break-all">
				{data.poolBalance
					? `${Number(data.poolBalance) / 1e18 < 1e-10 ? '~0' : Number(data.poolBalance) / 1e18} ${chainSymbol}`
					: `0 ${chainSymbol}`}
			</p>

			<h1 className="text-xs font-light text-gray-400">Borrowable Now</h1>
			<p className={cx('-mt-6 min-h-[1.5rem] break-all', isLoading ? 'placeholder-box w-20' : '')}>
				{poolAddlInfo?.maxNftsToBorrow}
			</p>

			<form
				onSubmit={(e) => {
					e.preventDefault()
					deposit?.()
				}}
				className="flex flex-col gap-2 sm:flex-row"
			>
				<label className="label flex-1">
					<span className="text-xs font-light text-gray-400">Deposit {chainSymbol}</span>
					<input
						name="amountToDeposit"
						className="input-field bg-[#202020]"
						autoComplete="off"
						autoCorrect="off"
						type="text"
						spellCheck="false"
						pattern="^[0-9]*[.,]?[0-9]*$"
						minLength={1}
						maxLength={79}
						inputMode="decimal"
						title="Enter numbers only."
						value={amountToDeposit}
						onChange={(e) => setAmountToDeposit(e.target.value)}
					/>
				</label>
				<button
					className="mt-auto min-h-[2.5rem] min-w-[7.5rem] rounded-lg bg-[#243b55] p-2 text-center text-sm text-white disabled:cursor-not-allowed"
					disabled={!deposit || approvingDeposit || confirmingDeposit || disableActions ? true : false}
				>
					{approvingDeposit || confirmingDeposit ? <BeatLoader /> : 'Deposit'}
				</button>
			</form>

			<form
				onSubmit={(e) => {
					e.preventDefault()
					withdraw?.()
				}}
				className="flex flex-col gap-2 sm:flex-row"
			>
				<label className="label flex-1">
					<span className="text-xs font-light text-gray-400">Withdraw {chainSymbol}</span>
					<input
						name="amountToWithdraw"
						className="input-field bg-[#202020]"
						autoComplete="off"
						autoCorrect="off"
						type="text"
						spellCheck="false"
						pattern="^[0-9]*[.,]?[0-9]*$"
						minLength={1}
						maxLength={79}
						inputMode="decimal"
						title="Enter numbers only."
						value={amountToWithdraw}
						onChange={(e) => setAmountToWithdraw(e.target.value)}
					/>
				</label>
				<button
					className="mt-auto min-h-[2.5rem] min-w-[7.5rem] rounded-lg bg-[#243b55] p-2 text-center text-sm text-white disabled:cursor-not-allowed"
					disabled={!withdraw || approvingWithdraw || confirmingWithdraw || disableActions ? true : false}
				>
					{approvingWithdraw || confirmingWithdraw ? <BeatLoader /> : 'Withdraw'}
				</button>
			</form>

			<form
				onSubmit={(e) => {
					e.preventDefault()
					updateLtv?.()
				}}
				className="flex flex-col gap-2 sm:flex-row"
			>
				<label className="label flex-1">
					<span className="text-xs font-light text-gray-400">Loan to Value (in %)</span>
					<input
						name="ltv"
						placeholder="33"
						minLength={1}
						maxLength={2}
						pattern="^(60|[1-5][0-9]?)$"
						title="Enter numbers only. Must be less than or equal to 60"
						value={ltv}
						onChange={(e) => setLtv(e.target.value)}
						className="input-field bg-[#202020]"
						autoComplete="off"
						autoCorrect="off"
						type="text"
						spellCheck="false"
					/>
				</label>
				<button
					className="mt-auto min-h-[2.5rem] min-w-[7.5rem] rounded-lg bg-[#243b55] p-2 text-center text-sm text-white disabled:cursor-not-allowed"
					disabled={!updateLtv || approvingLtvChange || confirmingLtvChange || disableActions ? true : false}
				>
					{approvingLtvChange || confirmingLtvChange ? <BeatLoader /> : 'Update'}
				</button>
			</form>

			<form
				onSubmit={(e) => {
					e.preventDefault()
					updateMaxPrice?.()
				}}
				className="flex flex-col gap-2 sm:flex-row"
			>
				<label className="label flex-1">
					<span className="text-xs font-light text-gray-400">Maximum floor price ({chainSymbol})</span>
					<input
						name="maxPrice"
						className="input-field bg-[#202020]"
						autoComplete="off"
						autoCorrect="off"
						type="text"
						spellCheck="false"
						pattern="^[0-9]*[.,]?[0-9]*$"
						minLength={1}
						maxLength={79}
						inputMode="decimal"
						title="Enter numbers only."
						value={newMaxPrice}
						onChange={(e) => setNewMaxPrice(e.target.value)}
					/>
				</label>
				<button
					className="mt-auto min-h-[2.5rem] min-w-[7.5rem] rounded-lg bg-[#243b55] p-2 text-center text-sm text-white disabled:cursor-not-allowed"
					disabled={
						!updateMaxPrice || approvingMaxPriceChange || confirmingMaxPriceChange || disableActions ? true : false
					}
				>
					{approvingMaxPriceChange || confirmingMaxPriceChange ? <BeatLoader /> : 'Update'}
				</button>
			</form>

			<form
				onSubmit={(e) => {
					e.preventDefault()
					updateMaxDailyBorrows?.()
				}}
				className="flex flex-col gap-2 sm:flex-row"
			>
				<label className="label flex-1">
					<span className="text-xs font-light text-gray-400">Maximum amount of borrowed {chainSymbol} each day</span>
					<input
						name="maxDailyBorrows"
						className="input-field bg-[#202020]"
						autoComplete="off"
						autoCorrect="off"
						type="text"
						spellCheck="false"
						pattern="^[0-9]*[.,]?[0-9]*$"
						minLength={1}
						maxLength={79}
						inputMode="decimal"
						title="Enter numbers only."
						value={newMaxDailyBorrows}
						onChange={(e) => setNewMaxDailyBorrows(e.target.value)}
					/>
				</label>
				<button
					className="mt-auto min-h-[2.5rem] min-w-[7.5rem] rounded-lg bg-[#243b55] p-2 text-center text-sm text-white disabled:cursor-not-allowed"
					disabled={
						!updateMaxDailyBorrows || approvingDailyBorrowsChange || confirmingDailyBorrowsChange || disableActions
							? true
							: false
					}
				>
					{approvingDailyBorrowsChange || confirmingDailyBorrowsChange ? <BeatLoader /> : 'Update'}
				</button>
			</form>

			<form
				onSubmit={(e) => {
					e.preventDefault()
					updateOracle?.()
				}}
				className="flex flex-col gap-2 sm:flex-row"
			>
				<label className="label flex-1">
					<span className="text-xs font-light text-gray-400">Oracle</span>
					<input
						name="oracle"
						className="input-field bg-[#202020]"
						autoComplete="off"
						autoCorrect="off"
						type="text"
						spellCheck="false"
						value={newOracle}
						onChange={(e) => setNewOracle(e.target.value)}
					/>
				</label>
				<button
					className="mt-auto min-h-[2.5rem] min-w-[7.5rem] rounded-lg bg-[#243b55] p-2 text-center text-sm text-white disabled:cursor-not-allowed"
					disabled={!updateOracle || approvingOracleChange || confirmingOracleChange || disableActions ? true : false}
				>
					{approvingOracleChange || confirmingOracleChange ? <BeatLoader /> : 'Update'}
				</button>
			</form>

			<form
				onSubmit={(e) => {
					e.preventDefault()
					addLiquidator?.()
					setLiquidatorAddress('')
				}}
				className="flex flex-col gap-2 sm:flex-row"
			>
				<label className="label flex-1">
					<span className="text-xs font-light text-gray-400">Add Liquidator</span>
					<input
						name="liquidatorAddress"
						className="input-field bg-[#202020]"
						autoComplete="off"
						autoCorrect="off"
						type="text"
						spellCheck="false"
						value={liquidatorAddress}
						onChange={(e) => setLiquidatorAddress(e.target.value)}
					/>
				</label>
				<button
					className="mt-auto min-h-[2.5rem] min-w-[7.5rem] rounded-lg bg-[#243b55] p-2 text-center text-sm text-white disabled:cursor-not-allowed"
					disabled={
						!addLiquidator || approvingNewLiquidator || confirmingNewLiquidator || disableActions ? true : false
					}
				>
					{approvingNewLiquidator || confirmingNewLiquidator ? <BeatLoader /> : 'Add'}
				</button>
			</form>

			{liquidators && liquidators.length > 0 && (
				<div className="flex flex-col gap-2">
					<h2 className="-mb-2 text-xs font-light text-gray-400">Liquidators</h2>
					{liquidators.map((liq) => (
						<RemoveLiquidator
							key={liq}
							poolAddress={data.address}
							userAddress={userAddress}
							disableActions={disableActions}
							address={liq}
							blockExplorerUrl={config.blockExplorer.url}
							chainId={chainId}
						/>
					))}
				</div>
			)}

			<form
				onSubmit={(e) => {
					e.preventDefault()
					updateInterest?.()
				}}
				className="flex flex-col gap-4"
			>
				<label className="label flex-1">
					<span className="text-xs font-light text-gray-400">Minimum annual interest</span>
					<input
						name="minimumInterest"
						className="input-field bg-[#202020]"
						autoComplete="off"
						autoCorrect="off"
						type="text"
						spellCheck="false"
						pattern="^[0-9]*[.,]?[0-9]*$"
						minLength={1}
						maxLength={79}
						inputMode="decimal"
						title="Enter numbers only."
						value={minInterest}
						onChange={(e) => {
							const value = Number(e.target.value)

							if (Number.isNaN(value)) {
								setMinInterest('')
							} else {
								setMinInterest(e.target.value)
							}
						}}
					/>
				</label>

				<label className="label mb-4 flex-1">
					<span className="text-xs font-light text-gray-400">Maximum annual interest</span>
					<input
						name="maxInterest"
						className="input-field bg-[#202020]"
						autoComplete="off"
						autoCorrect="off"
						type="text"
						spellCheck="false"
						pattern="^[0-9]*[.,]?[0-9]*$"
						minLength={1}
						maxLength={79}
						inputMode="decimal"
						title="Enter numbers only."
						value={maxInterest}
						onChange={(e) => {
							const value = Number(e.target.value)

							if (Number.isNaN(value)) {
								setMaxInterest('')
							} else {
								setMaxInterest(e.target.value)
							}
						}}
					/>
				</label>

				<PoolUtilisationChart
					minInterest={isInvalidInterests ? 0 : debouncedMinInterest}
					maxInterest={isInvalidInterests ? 0 : debouncedMaxInterest}
				/>

				<button
					className="mt-2 min-h-[2.5rem] min-w-[7.5rem] rounded-lg bg-[#243b55] p-2 text-center text-sm text-white disabled:cursor-not-allowed"
					disabled={
						!updateInterest || approvingInterestChange || confirmingInterestChange || disableActions ? true : false
					}
				>
					{approvingInterestChange || confirmingInterestChange ? <BeatLoader /> : 'Change Interest'}
				</button>
			</form>

			<button
				className="mt-4 min-h-[2.5rem] min-w-[7.5rem] rounded-lg bg-red-700 p-2 text-center text-sm text-white disabled:cursor-not-allowed"
				disabled={!emergencyShutdown || approvingShutdown || confirmingShutdown || disableActions ? true : false}
				onClick={() => emergencyShutdown?.()}
			>
				{approvingShutdown || confirmingShutdown ? <BeatLoader /> : 'Shutdown Borrows'}
			</button>
		</div>
	)
}

const RemoveLiquidator = ({
	address,
	blockExplorerUrl,
	chainId,
	userAddress,
	poolAddress,
	disableActions
}: {
	address: string
	blockExplorerUrl: string
	chainId: number
	userAddress: string
	poolAddress: string
	disableActions: boolean
}) => {
	const {
		write: removeLiquidator,
		isLoading: approvingLiquidatorRemoval,
		waitForTransaction: { isLoading: confirmingLiquidatorRemoval }
	} = useRemoveLiquidator({
		liquidatorAddress: address,
		chainId,
		userAddress,
		poolAddress: poolAddress
	})

	return (
		<div className="flex flex-col gap-2 sm:flex-row">
			<a
				className="flex-1 py-2 text-base"
				target="_blank"
				rel="noreferrer noopener"
				href={`${blockExplorerUrl}/address/${address}`}
			>
				{address}
			</a>
			<button
				className="mt-auto min-h-[2.5rem] min-w-[7.5rem] rounded-lg bg-red-700 p-2 text-center text-sm text-white disabled:cursor-not-allowed"
				onClick={() => removeLiquidator?.()}
				disabled={
					!removeLiquidator || approvingLiquidatorRemoval || confirmingLiquidatorRemoval || disableActions
						? true
						: false
				}
			>
				{approvingLiquidatorRemoval || confirmingLiquidatorRemoval ? <BeatLoader /> : 'Remove'}
			</button>
		</div>
	)
}
