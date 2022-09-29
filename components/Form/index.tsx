import { ReactNode } from 'react'

interface IInputProps {
	name: string
	label: ReactNode
	placeholder: string
	required?: boolean
}

export function InputText({ label, ...props }: IInputProps) {
	return (
		<label className="label">
			<span>{label}</span>
			<input className="input-field" autoComplete="off" autoCorrect="off" type="text" spellCheck="false" {...props} />
		</label>
	)
}

export function InputNumber({ label, ...props }: IInputProps) {
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
		</label>
	)
}
