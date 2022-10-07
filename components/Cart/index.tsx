import * as React from 'react'
import { useMedia } from '~/hooks'
import { BorrowCartItems } from './CartItems'
import { DesktopOnlyCart } from './Desktop'
import { MobileOnlyCart } from './Mobile'
import type { IBorrowCartProps } from './types'

function CartWrapper({ children }: { children: React.ReactNode }) {
	const isDesktop = useMedia('(min-width: 80rem)', true)

	return (
		<React.Suspense fallback={null}>
			{isDesktop ? <DesktopOnlyCart>{children}</DesktopOnlyCart> : <MobileOnlyCart>{children}</MobileOnlyCart>}
		</React.Suspense>
	)
}

export function BorrowCart(props: IBorrowCartProps) {
	return (
		<CartWrapper>
			<BorrowCartItems {...props} />
		</CartWrapper>
	)
}
