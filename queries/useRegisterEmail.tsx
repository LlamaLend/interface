import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { EMAIL_SERVER_API } from '~/lib/constants'
import type { ITransactionError } from '~/types'

async function registerEmail({ email, address }: { email?: string; address?: string }) {
	try {
		if (typeof email !== 'string' || typeof address !== 'string') {
			throw new Error('Invalid arguments')
		}
		const res = await fetch(EMAIL_SERVER_API, {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({ email, address })
		})

		if (res.ok) {
			return 'Success'
		} else {
			const { message } = await res.json()
			throw new Error(message)
		}
	} catch (error: any) {
		throw new Error(error.message || (error?.reason ?? "Something went wrong, couldn't register your email"))
	}
}

export default function useRegisterEmail() {
	return useMutation(registerEmail, {
		onSuccess: () => {
			toast.success('Registration Success')
		},
		onError: (error: ITransactionError) => {
			toast.error(error.message)
		}
	})
}
