import { cx } from 'cva'
import * as React from 'react'

interface IGridProps {
	children: React.ReactNode
	className?: string
}

export default function GridWrapper({ className, children }: IGridProps) {
	return (
		<ul
			className={cx(
				'grid grid-cols-[repeat(auto-fit,minmax(240px,260px))] place-content-center gap-8 sm:place-content-start',
				className
			)}
		>
			{children}
		</ul>
	)
}
