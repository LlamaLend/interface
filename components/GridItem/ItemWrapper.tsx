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
				'flex flex-col gap-4 min-h-[300px] min-w-[240px] bg-[#191919] rounded-xl shadow backdrop-blur p-4',
				className
			)}
		>
			{children}
		</li>
	)
}
