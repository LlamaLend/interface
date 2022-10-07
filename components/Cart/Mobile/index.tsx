import * as React from 'react'
import { useAccount, useNetwork } from 'wagmi'
import Wrapper from './Wrapper'

export function MobileOnlyCart({ children }: { children: React.ReactNode }) {
	const { isConnected } = useAccount()
	const { chain } = useNetwork()

	if (!isConnected) {
		return (
			<Wrapper>
				<p className="xl:mt-[60%] text-center mt-8 mb-9 text-sm">Connect wallet to view items in cart.</p>
			</Wrapper>
		)
	}

	if (chain?.unsupported) {
		return (
			<Wrapper>
				<p className="xl:mt-[60%] text-center mt-8 mb-9 text-sm">
					Connect wallet to supported network to view items in cart.
				</p>
			</Wrapper>
		)
	}

	return <Wrapper>{children}</Wrapper>
}
