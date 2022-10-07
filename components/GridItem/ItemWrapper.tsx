import * as React from 'react'
import { cx } from 'cva'

interface IGridItemProps {
	children: React.ReactNode
	className?: string
}

export default function ItemWrapper({ className, children }: IGridItemProps) {
	return (
		<li
			className={cx(
				'flex min-h-[300px] min-w-[240px] flex-col gap-4 rounded-xl bg-[#191919] p-4 shadow backdrop-blur',
				className
			)}
		>
			{children}
		</li>
	)
}
