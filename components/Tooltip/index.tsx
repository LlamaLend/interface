import { Button } from 'ariakit/button'
import { Tooltip as AriaTooltip, TooltipAnchor, useTooltipState } from 'ariakit/tooltip'

export default function Tooltip() {
	const tooltip = useTooltipState()
	return (
		<>
			<TooltipAnchor state={tooltip} as={Button} className="">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
					<path
						fillRule="evenodd"
						d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z"
						clipRule="evenodd"
					/>
				</svg>
			</TooltipAnchor>
			<AriaTooltip state={tooltip} className="rounded-xl bg-[#202020] p-2 text-white shadow">
				You only pay for the time borrowed
			</AriaTooltip>
		</>
	)
}
