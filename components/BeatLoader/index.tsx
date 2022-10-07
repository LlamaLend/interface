import React from 'react'

export default function BeatLoader({ size = '6px', color = 'white' }: { size?: string; color?: string }) {
	return (
		<span
			className="flex h-6 items-center justify-center"
			style={{ '--circle-size': size, '--circle-color': color } as React.CSSProperties}
		>
			<span className="beat-circle"></span>
			<span className="beat-circle center"></span>
			<span className="beat-circle"></span>
		</span>
	)
}
