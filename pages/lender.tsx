import type { NextPage } from 'next'
import { useAccount, useNetwork } from 'wagmi'
import LenderStatsContainer from '~/containers/LenderContainer'

const Repay: NextPage = () => {
	const { chain } = useNetwork()
	const { address } = useAccount()

	// by default if wallet is not connected, show loans on ethereum
	return <LenderStatsContainer chainId={chain?.id ?? 1} chainName={chain?.name ?? 'Ethereum'} lenderAddress={address} />
}

export default Repay
