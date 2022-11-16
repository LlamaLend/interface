import { useState } from 'react'
import * as RadixSlider from '@radix-ui/react-slider'

export const Slider = ({
	range,
	label,
	symbol,
	decimals,
	disabled,
	onValueCommit
}: {
	range: Array<number>
	label: string
	symbol: string
	decimals: number
	disabled: boolean
	onValueCommit: (value: Array<number>) => void
}) => {
	const [min, max] = range
	const [value, setValue] = useState([min, max])

	const step = Number(
		((max - min) / 20).toLocaleString('en-US', {
			maximumFractionDigits: decimals
		})
	)

	return (
		<label className="flex flex-col gap-2">
			<span className="-mb-1 flex w-full justify-between text-xs text-[#3E424E]">
				<span>{min}</span>
				<span>{max}</span>
			</span>
			<RadixSlider.Root
				className="relative flex h-[20px] w-full touch-none select-none items-center"
				min={min}
				defaultValue={[min, max]}
				max={max}
				step={step}
				minStepsBetweenThumbs={step}
				disabled={disabled}
				value={value}
				onValueChange={(newValue) => setValue(newValue)}
				onValueCommit={onValueCommit}
			>
				<RadixSlider.Track className="relative h-2 w-full rounded-[30px] bg-[#22242A]">
					<RadixSlider.Range className="absolute h-full rounded-full bg-[#3046FB]" />
				</RadixSlider.Track>
				<RadixSlider.Thumb className="block h-3 w-3 rounded-full border-2 border-white bg-[#3046FB]">
					<span className="absolute -top-6 -left-1 whitespace-nowrap bg-primary px-[2px] text-xs text-white">{`${value[0]} ${symbol}`}</span>
				</RadixSlider.Thumb>
				<RadixSlider.Thumb className="block h-3 w-3 rounded-full border-2 border-white bg-[#3046FB]">
					<span className="absolute -top-6 -left-1 whitespace-nowrap bg-primary px-[2px] text-xs text-white">{`${value[1]} ${symbol}`}</span>
				</RadixSlider.Thumb>
			</RadixSlider.Root>
			<span className="text-sm text-[#D4D4D8]">{label}</span>
		</label>
	)
}
