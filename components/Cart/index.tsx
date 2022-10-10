import * as React from 'react'
import { useMedia } from '~/hooks'
import { BorrowCartItems, RepayCartItems } from './CartItems'
import { DesktopOnlyCart } from './Desktop'
import { MobileOnlyCart } from './Mobile'
import type { IBorrowCartProps, IRepayCartProps } from './types'

function CartWrapper({ className, children }: { className?: string; children: React.ReactNode }) {
	const isDesktop = useMedia('(min-width: 80rem)', true)

	return (
		<React.Suspense fallback={null}>
			{isDesktop ? (
				<DesktopOnlyCart className={className}>{children}</DesktopOnlyCart>
			) : (
				<MobileOnlyCart>{children}</MobileOnlyCart>
			)}
		</React.Suspense>
	)
}

export function BorrowCart(props: IBorrowCartProps) {
	return <CartWrapper>{!props.isLoading && <BorrowCartItems {...props} />}</CartWrapper>
}

export function RepayCart(props: IRepayCartProps) {
	return (
		<CartWrapper className="top-6 bottom-6 mt-9 max-h-[calc(100vh-48px)]">
			{!props.isLoading && <RepayCartItems {...props} />}
		</CartWrapper>
	)
}
