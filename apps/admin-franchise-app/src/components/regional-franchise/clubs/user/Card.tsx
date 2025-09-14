export default function Card({
	title,
	children,
	footer,
}: {
	title: string;
	children: React.ReactNode;
	footer?: React.ReactNode;
}) {
	return (
		<section className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
			<div className="border-b border-zinc-100 px-4 py-3">
				<h2 className="text-sm font-medium">{title}</h2>
			</div>
			<div className="p-4">{children}</div>
			{footer ? (
				<div className="border-t border-zinc-100 px-4 py-3">{footer}</div>
			) : null}
		</section>
	);
}
