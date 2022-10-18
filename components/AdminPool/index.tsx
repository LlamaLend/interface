import { useState } from 'react'
import { useDebounce } from '~/hooks'
import dynamic from 'next/dynamic'
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

	const { nftName, poolBalance, maxPrice, maxDailyBorrows, oracle, minimumInterest, maximumInterest } =
		data.adminPoolInfo

	const [ltv, setLtv] = useState<string>((data.ltv / 1e16).toFixed(0))

	const [newMaxPrice, setNewMaxPrice] = useState<string>(maxPrice ? (maxPrice / 1e18).toFixed(3) : '0')
	const [newOracle, setNewOracle] = useState<string>(oracle || '')

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
			<p className="text-xs font-light text-gray-400">Pool</p>
			<h1 className="-my-6 text-lg">{`${data.name} (${data.symbol})`}</h1>
			<a
				target="_blank"
				rel="noreferrer noopener"
				href={`${config.blockExplorer.url}/address/${data.address}`}
				className="w-fit break-all text-xs"
			>
				{data.address}
			</a>

			<p className="text-xs font-light text-gray-400">Collection</p>
			<h2 className="-my-6 min-h-[1.75rem] text-lg">{nftName}</h2>
			<a
				target="_blank"
				rel="noreferrer noopener"
				href={`${config.blockExplorer.url}/address/${data.nftContract}`}
				className="w-fit break-all text-xs"
			>
				{data.nftContract}
			</a>

			<p className="flex flex-col gap-1">
				<span className="text-xs font-light text-gray-400">Balance</span>
				<span className="min-h-[1.5rem] break-all">
					{poolBalance && `${poolBalance / 1e18 < 1e-10 ? '~0' : poolBalance / 1e18} ${chainSymbol}`}
				</span>
			</p>

			<p className="flex flex-col gap-1">
				<span className="text-xs font-light text-gray-400">Borrowable Now</span>
				<span>{data.maxNftsToBorrow}</span>
			</p>

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
					<span className="text-xs font-light text-gray-400">Maximum {chainSymbol} per NFT</span>
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
					updateInterest?.()
				}}
				className="flex flex-col gap-2"
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
					className="mt-4 min-h-[2.5rem] min-w-[7.5rem] rounded-lg bg-[#243b55] p-2 text-center text-sm text-white disabled:cursor-not-allowed"
					disabled={
						!updateInterest || approvingInterestChange || confirmingInterestChange || disableActions ? true : false
					}
				>
					{approvingInterestChange || confirmingInterestChange ? <BeatLoader /> : 'Change Interest'}
				</button>
			</form>

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

			<button
				className="mt-auto min-h-[2.5rem] min-w-[7.5rem] rounded-lg bg-red-700 p-2 text-center text-sm text-white disabled:cursor-not-allowed"
				disabled={!emergencyShutdown || approvingShutdown || confirmingShutdown || disableActions ? true : false}
				onClick={() => emergencyShutdown?.()}
			>
				{approvingShutdown || confirmingShutdown ? <BeatLoader /> : 'Shutdown Borrows'}
			</button>
		</div>
	)
}
