import * as React from 'react'
import { useAccount, useNetwork } from 'wagmi'
import Wrapper from './Wrapper'

export function DesktopOnlyCart({ className, children }: { className?: string; children: React.ReactNode }) {
	const { isConnected } = useAccount()
	const { chain } = useNetwork()

	if (!isConnected) {
		return (
			<Wrapper className={className}>
				<p className="mt-8 mb-9 text-center text-sm xl:mt-[60%]">Connect wallet to view items in cart.</p>
			</Wrapper>
		)
	}

	if (chain?.unsupported) {
		return (
			<Wrapper className={className}>
				<p className="mt-8 mb-9 text-center text-sm xl:mt-[60%]">
					Connect wallet to the app's supported network to view items in cart.
				</p>
			</Wrapper>
		)
	}

	return <Wrapper className={className}>{children}</Wrapper>
}
