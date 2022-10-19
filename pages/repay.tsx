import type { NextPage } from 'next'
import { useAccount, useNetwork } from 'wagmi'
import RepayPoolsContainer from '~/containers/RepayPoolsContainer'

const Repay: NextPage = () => {
	const { chain } = useNetwork()
	const { address } = useAccount()

	// by default if wallet is not connected, show loans on ethereum
	return <RepayPoolsContainer chainId={chain?.id ?? 1} chainName={chain?.name ?? 'Ethereum'} userAddress={address} />
}

export default Repay
