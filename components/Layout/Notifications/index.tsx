import { FormEvent, useCallback } from 'react'
import { Popover, PopoverDisclosure, PopoverStateRenderCallbackProps, usePopoverState } from 'ariakit/popover'
import assignStyle from './assign-style'
import useMedia from './use-media'
import useRegisterEmail from '~/queries/useRegisterEmail'
import { useAccount } from 'wagmi'
import BeatLoader from '~/components/BeatLoader'

function applyMobileStyles(popover: HTMLElement) {
	const restorePopoverStyle = assignStyle(popover, {
		position: 'fixed',
		bottom: '0',
		width: '100%',
		padding: '12px'
	})

	const restoreDesktopStyles = () => {
		restorePopoverStyle()
	}
	return restoreDesktopStyles
}

export default function Notifications() {
	const { address, isConnected } = useAccount()
	const isLarge = useMedia('(min-width: 640px)', true)

	const renderCallback = useCallback(
		(props: PopoverStateRenderCallbackProps) => {
			const { popover, defaultRenderCallback } = props
			if (isLarge) return defaultRenderCallback()
			return applyMobileStyles(popover)
		},
		[isLarge]
	)

	const popover = usePopoverState({ renderCallback })

	const { isLoading, mutate } = useRegisterEmail()

	const registerEmail = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const form = e.target as HTMLFormElement & { email: { value: string } }
		mutate({ email: form.email.value, address })
	}

	return (
		<>
			<PopoverDisclosure state={popover} className="rounded-lg bg-white px-2 py-2 text-black">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="h-6 w-6"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
					/>
				</svg>
				<span className="sr-only">Notifications</span>
			</PopoverDisclosure>
			<Popover
				state={popover}
				modal={!isLarge}
				className="z-50 flex flex-col overflow-auto overscroll-contain rounded-lg border border-[#292929] bg-[#181818] p-4 text-sm text-white shadow-xl sm:max-w-[360px]"
			>
				<p className="mt-4">
					Get notified when your loan is about to expire by DMing @LlamaBankmanFried in our{' '}
					<a
						href="https://discord.com/channels/1021249771073175552/1038181488069447832"
						target="_blank"
						rel="noreferrer noopener"
						className="underline"
					>
						discord
					</a>{' '}
					with the message <span className="rounded bg-black py-1 px-2">/register your_address</span>
				</p>

				<p className="my-4 text-center text-xs text-gray-500">or</p>

				<form onSubmit={registerEmail}>
					<label className="label text-sm">
						<span>Get notified by Email</span>
						<input name="email" className="input-field bg-black" type="email" required />
					</label>
					<small className="mt-4 text-gray-500">Connect wallet with the address you want to get notified for</small>
					<button
						className="mt-4 min-h-[2.5rem] w-full rounded-lg bg-[#243b55] p-2 text-white disabled:cursor-not-allowed"
						disabled={!isConnected || !address}
					>
						{isLoading ? <BeatLoader /> : 'Register'}
					</button>
				</form>
			</Popover>
		</>
	)
}
