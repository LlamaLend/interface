import Image from 'next/future/image'
import ItemWrapper from './ItemWrapper'

export function RepayNftPlaceholder() {
	return (
		<ItemWrapper className="gap-0 !p-2 text-sm">
			<div className="placeholder-box relative -mx-2 -mt-2 aspect-square rounded-t-xl bg-[#202020]"></div>

			<div className="mt-2 mb-4 flex h-5 flex-wrap items-center justify-between gap-4">
				<div className="placeholder-box h-4 w-[10ch]"></div>

				<div className="flex items-center gap-1.5 text-[#c6c6c6]">
					<span className="sr-only">Time left to repay loan</span>
					<svg
						stroke="currentColor"
						fill="none"
						strokeWidth="2"
						viewBox="0 0 24 24"
						strokeLinecap="round"
						strokeLinejoin="round"
						height="14px"
						width="14px"
						xmlns="http://www.w3.org/2000/svg"
					>
						<circle cx="12" cy="12" r="10"></circle>
						<polyline points="12 6 12 12 16 14"></polyline>
					</svg>
					<div className="placeholder-box h-4 w-[10ch]"></div>
				</div>
			</div>

			<h4 className="mt-auto">To Pay</h4>

			<div className="flex flex-wrap items-center justify-between gap-4">
				<div className="flex items-center gap-1.5">
					<Image src="/assets/ethereum.png" height={16} width={16} className="object-contain" alt="ethereum" />
					<div className="placeholder-box h-4 w-[6ch]"></div>
				</div>
				<div className="rounded-xl bg-[#243b55] text-center text-sm text-white text-opacity-40">
					<div className="h-[1.875rem] w-[5.5rem]"></div>
				</div>
			</div>
		</ItemWrapper>
	)
}
