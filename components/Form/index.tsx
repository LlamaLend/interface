import { ChangeEvent, ReactNode } from 'react'

interface IInputProps {
	name: string
	label: ReactNode
	placeholder: string
	required?: boolean
	pattern?: string
	title?: string
	helperText?: string
	onChange?: (e: ChangeEvent<HTMLInputElement>) => void
	maxLength?: number
	defaultValue?: string
}

export function InputText({ label, helperText, ...props }: IInputProps) {
	return (
		<label className="label">
			<span>{label}</span>
			<input className="input-field" autoComplete="off" autoCorrect="off" type="text" spellCheck="false" {...props} />
			{helperText && <small className="text-[#708cbf]">{helperText}</small>}
		</label>
	)
}

export function InputNumber({ label, helperText, ...props }: IInputProps) {
	return (
		<label className="label">
			<span>{label}</span>
			<input
				className="input-field"
				autoComplete="off"
				autoCorrect="off"
				type="text"
				spellCheck="false"
				pattern="^[0-9]*[.,]?[0-9]*$"
				minLength={1}
				maxLength={79}
				inputMode="decimal"
				title="Enter numbers only."
				{...props}
			/>
			{helperText && <small className="text-[#708cbf]">{helperText}</small>}
		</label>
	)
}
