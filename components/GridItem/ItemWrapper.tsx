import * as React from 'react'

interface IGridItemProps {
	children: React.ReactNode
}

export default function ItemWrapper({ children }: IGridItemProps) {
	return (
		<li className="flex flex-col min-h-[300px] min-w-[240px] bg-[#191919] rounded-xl shadow backdrop-blur">
			{children}
		</li>
	)
}
