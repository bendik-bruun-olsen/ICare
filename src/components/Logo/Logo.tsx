export default function Logo({ size, color }: { size: string; color: string }) {
	return (
		<span
			style={{
				color: color ? color : "var(--white)",
				textAlign: "center",
				fontSize: size ? size : "32px",
				fontFamily: "'Lora', serif",
				fontWeight: "500",
				fontStyle: "italic",
			}}
		>
			iCare
		</span>
	);
}
