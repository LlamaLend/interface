import type { NextPage } from 'next'
import { useAccount, useNetwork } from 'wagmi'
import LiquidateContainer from '~/containers/LiquidateContainer'

const Liquidate: NextPage = () => {
	const { chain } = useNetwork()
	const { address } = useAccount()

	// by default if wallet is not connected, show loans on ethereum
	return <LiquidateContainer chainId={chain?.id ?? 1} chainName={chain?.name ?? 'Ethereum'} userAddress={address} />
}

export default Liquidate
