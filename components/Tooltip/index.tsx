import * as React from 'react'
import { Button } from 'ariakit/button'
import { Tooltip as AriaTooltip, TooltipAnchor, useTooltipState } from 'ariakit/tooltip'

interface ITooltip {
	children: React.ReactNode
	content: React.ReactNode
}

export default function Tooltip({ children, content }: ITooltip) {
	const tooltip = useTooltipState()
	return (
		<>
			<TooltipAnchor state={tooltip} as={Button} className="flex items-center">
				{children}
			</TooltipAnchor>
			<AriaTooltip state={tooltip} className="max-w-[300px] rounded-xl bg-[#202020] p-2 text-sm text-white shadow">
				{content}
			</AriaTooltip>
		</>
	)
}
