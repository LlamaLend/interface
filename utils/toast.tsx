import { ReactNode } from 'react'
import toast from 'react-hot-toast'

interface ITxSuccess {
	txHash: string
	blockExplorer: {
		url: string
		name: string
	}
	content: ReactNode
}

interface ITxError {
	txHash: string
	blockExplorer: {
		url: string
		name: string
	}
}

export const txSuccess = ({ txHash, blockExplorer, content }: ITxSuccess) => {
	toast.success(
		() => {
			return (
				<div className="toastWithLink">
					{content && <span>{content}</span>}
					<a href={blockExplorer.url + '/tx/' + txHash} target="_blank" rel="noopener noreferrer">
						View on Etherscan
					</a>
				</div>
			)
		},
		{
			duration: 5000
		}
	)
}

export const txError = ({ txHash, blockExplorer }: ITxError) => {
	toast.error(
		() => {
			return (
				<div className="toastWithLink">
					<span>Transaction Failed</span>
					<a href={blockExplorer.url + '/tx/' + txHash} target="_blank" rel="noopener noreferrer">
						View on Etherscan
					</a>
				</div>
			)
		},
		{
			duration: 5000
		}
	)
}
