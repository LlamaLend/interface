import { cx } from 'cva'
import { ChangeEvent, ReactNode, useState } from 'react'

interface IInputProps {
	name: string
	label: ReactNode
	placeholder: string
	required?: boolean
	pattern?: string
	title?: string
	helperText?: string
	onChange?: (e: ChangeEvent<HTMLInputElement>) => void
	isError?: boolean
	maxLength?: number
	defaultValue?: string
}

export function InputText({ label, helperText, isError, ...props }: IInputProps) {
	return (
		<label className="label">
			<span>{label}</span>
			<input className="input-field" autoComplete="off" autoCorrect="off" type="text" spellCheck="false" {...props} />
			{helperText && <small className={isError ? 'text-red-500' : 'text-[#708cbf]'}>{helperText}</small>}
		</label>
	)
}

export function InputNumber({ label, helperText, isError, ...props }: IInputProps) {
	const [showError, setError] = useState(false)

	return (
		<label className="label">
			<span>{label}</span>
			<input
				className={cx('input-field', isError && showError ? 'ring-1 ring-red-500' : '')}
				autoComplete="off"
				autoCorrect="off"
				type="text"
				spellCheck="false"
				pattern="^[0-9]*[.,]?[0-9]*$"
				minLength={1}
				maxLength={79}
				inputMode="decimal"
				title="Enter numbers only."
				onBlur={() => setError(true)}
				{...props}
			/>
			{helperText && <small className="text-[#708cbf]">{helperText}</small>}
		</label>
	)
}
