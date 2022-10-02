import * as React from 'react'

interface IGridProps {
	children: React.ReactNode
}

export default function GridWrapper({ children }: IGridProps) {
	return (
		<ul className="grid grid-cols-[repeat(auto-fit,minmax(240px,260px))] place-content-center gap-8 mt-8 mb-auto mx-0 sm:my-9 sm:place-content-start">
			{children}
		</ul>
	)
}
