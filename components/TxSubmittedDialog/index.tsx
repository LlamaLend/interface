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
		<Dialog state={dialog} className="dialog">
			<header className="flex items-center justify-end">
				<button className="buttonDismiss" onClick={dialog.toggle}>
					<span className="sr-only">Close</span>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={18} height={18}>
						<path
							fillRule="evenodd"
							d="M3.97 3.97a.75.75 0 011.06 0L12 10.94l6.97-6.97a.75.75 0 111.06 1.06L13.06 12l6.97 6.97a.75.75 0 11-1.06 1.06L12 13.06l-6.97 6.97a.75.75 0 01-1.06-1.06L10.94 12 3.97 5.03a.75.75 0 010-1.06z"
							clipRule="evenodd"
						/>
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
			<h1 className="text-xl font-medium text-center">Transaction Submitted</h1>
			<a
				href={(blockExplorer?.url ?? 'https://etherscan.io') + '/tx/' + transactionHash.current}
				target="_blank"
				rel="noopener noreferrer"
				className="text-sm font-semibold text-center text-blue-500 -mt-5"
			>
				{`View on ${blockExplorer?.name ?? 'Etherscan'}`}
			</a>
			<button onClick={dialog.toggle} className="p-2 rounded-lg mt-5 bg-blue-500 shadow">
				Close
			</button>
		</Dialog>
	)
}
