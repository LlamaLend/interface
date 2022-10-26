import { useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import type { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useAccount, useNetwork } from 'wagmi'
import BeatLoader from '~/components/BeatLoader'
import Layout from '~/components/Layout'
import { chainConfig } from '~/lib/constants'
import useDeposit from '~/queries/admin/useDeposit'

interface IPageProps {
	chainId?: number
	chainName?: string
	poolAddress?: string
}

const Manage: NextPage<IPageProps> = ({ poolAddress }) => {
	const { address, isConnected } = useAccount()
	const { chain } = useNetwork()

	const { openConnectModal } = useConnectModal()
	const { openChainModal } = useChainModal()

	const config = chainConfig(chain?.id)

	const router = useRouter()

	const [amountToDeposit, setAmountToDeposit] = useState<string>('')

	const redirectFn = () => {
		router.push(`/borrow/${chain?.name}/${poolAddress}`)
	}

	const {
		write: deposit,
		isLoading: approvingDeposit,
		waitForTransaction: { isLoading: confirmingDeposit }
	} = useDeposit({
		amountToDeposit,
		chainId: chain?.id,
		userAddress: address,
		poolAddress,
		redirectFn
	})

	const chainSymbol = config.nativeCurrency?.symbol

	return (
		<Layout>
			{!poolAddress ? (
				<p className="fallback-text">
					<p className="fallback-text">Invalid pool address, Please check URL validity.</p>
				</p>
			) : (
				<div className="my-8 flex w-full flex-col items-center justify-center gap-8">
					<form
						onSubmit={(e) => {
							e.preventDefault()
							deposit?.()
						}}
						className="mt-8 flex flex-col gap-2"
					>
						<label className="label flex-1">
							<span className="break-all">
								Deposit {chainSymbol} in {poolAddress}
							</span>
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
						{!isConnected ? (
							<button
								className="mt-auto min-h-[2.5rem] min-w-[7.5rem] rounded-lg bg-[#243b55] p-2 text-center text-sm text-white disabled:cursor-not-allowed"
								onClick={openConnectModal}
							>
								Connect Wallet
							</button>
						) : chain?.unsupported ? (
							<button
								className="mt-auto min-h-[2.5rem] min-w-[7.5rem] rounded-lg bg-[#243b55] p-2 text-center text-sm text-white disabled:cursor-not-allowed"
								onClick={openChainModal}
							>
								Switch Network
							</button>
						) : (
							<button
								className="mt-auto min-h-[2.5rem] min-w-[7.5rem] rounded-lg bg-[#243b55] p-2 text-center text-sm text-white disabled:cursor-not-allowed"
								disabled={!deposit || approvingDeposit || confirmingDeposit || !poolAddress ? true : false}
							>
								{approvingDeposit || confirmingDeposit ? <BeatLoader /> : 'Confirm Deposit'}
							</button>
						)}
					</form>
				</div>
			)}
		</Layout>
	)
}

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
	res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=59')

	const poolAddress = typeof query.poolAddress === 'string' && query.poolAddress

	if (!poolAddress) {
		return {
			props: {}
		}
	}

	const validUserAddress = poolAddress.length === 42 ? poolAddress : null

	return {
		props: {
			poolAddress: validUserAddress
		}
	}
}

export default Manage
