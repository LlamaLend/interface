import * as React from 'react'
import { useMedia } from '~/hooks'
import { DesktopOnlyCart } from './Desktop'
import { MobileOnlyCart } from './Mobile'

export default function Cart() {
	const isDesktop = useMedia('(min-width: 80rem)', true)

	return <React.Suspense fallback={null}>{isDesktop ? <DesktopOnlyCart /> : <MobileOnlyCart />}</React.Suspense>
}
