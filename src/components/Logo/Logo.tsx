interface LogoProps {
	size?: string;
	color?: string;
}

export default function Logo({
	size = "32px",
	color = "var(--white)",
}: LogoProps) {
	return (
		<span
			style={{
				color: color,
				textAlign: "center",
				fontSize: size,
				fontFamily: "'Lora', serif",
				fontWeight: "500",
				fontStyle: "italic",
			}}
		>
			iCare
		</span>
	);
}
