import * as React from 'react'
import { DisclosureState } from 'ariakit'
import { Dialog } from 'ariakit/dialog'
import { useNetwork } from 'wagmi'

interface FormDialogProps {
	dialog: DisclosureState
	transactionHash: React.RefObject<string>
}

export default function TxSubmittedDialog({ dialog, transactionHash }: FormDialogProps) {
	const { chain } = useNetwork()

	const blockExplorer = chain?.blockExplorers?.default

	return (
		<Dialog state={dialog} className="dialog z-20">
			<header className="flex items-center justify-end">
				<button className="buttonDismiss" onClick={dialog.toggle}>
					<span className="sr-only">Close</span>
					<svg
						aria-hidden="true"
						fill="none"
						height="10"
						viewBox="0 0 10 10"
						width="10"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M1.70711 0.292893C1.31658 -0.0976311 0.683417 -0.0976311 0.292893 0.292893C-0.0976311 0.683417 -0.0976311 1.31658 0.292893 1.70711L3.58579 5L0.292893 8.29289C-0.0976311 8.68342 -0.0976311 9.31658 0.292893 9.70711C0.683417 10.0976 1.31658 10.0976 1.70711 9.70711L5 6.41421L8.29289 9.70711C8.68342 10.0976 9.31658 10.0976 9.70711 9.70711C10.0976 9.31658 10.0976 8.68342 9.70711 8.29289L6.41421 5L9.70711 1.70711C10.0976 1.31658 10.0976 0.683417 9.70711 0.292893C9.31658 -0.0976311 8.68342 -0.0976311 8.29289 0.292893L5 3.58579L1.70711 0.292893Z"
							fill="currentColor"
						></path>
					</svg>
				</button>
			</header>
			<div className="my-5 flex items-center justify-center text-blue-500">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="80"
					height="80"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="0.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<circle cx="12" cy="12" r="10"></circle>
					<polyline points="16 12 12 8 8 12"></polyline>
					<line x1="12" y1="16" x2="12" y2="8"></line>
				</svg>
			</div>
			<h1 className="text-center text-xl font-medium">Transaction Submitted</h1>
			<a
				href={(blockExplorer?.url ?? 'https://etherscan.io') + '/tx/' + transactionHash.current}
				target="_blank"
				rel="noopener noreferrer"
				className="-mt-5 text-center text-sm font-semibold text-blue-500"
			>
				{`View on ${blockExplorer?.name ?? 'Etherscan'}`}
			</a>
			<button onClick={dialog.toggle} className="mt-5 rounded-lg bg-blue-500 p-2 shadow">
				Close
			</button>
		</Dialog>
	)
}
