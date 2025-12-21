export default function DashboardContainer({
	title,
	description,
	children,
	card,
}: {
	title: string;
	description: string;
	children: React.ReactNode;
	card?: React.ReactNode;
}) {
	return (
		<div className="space-y-8 container *:mx-auto py-6">
			<div className="space-y-4">
				<div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
					<div className="space-y-1">
						<div className="inline-block px-2 py-0.5 bg-primary/10 border border-primary/20 text-[8px] font-black uppercase tracking-[0.3em] text-primary mb-1">
							DATA_STREAM // 01
						</div>
						<h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase text-foreground">
							{title}
						</h1>
					</div>
					{card && <div className="mt-4">{card}</div>}
				</div>
				<p className="text-muted-foreground text-sm font-medium uppercase tracking-[0.1em] opacity-80 max-w-2xl">
					{description}
				</p>
				<div className="h-0.5 w-24 bg-primary/30" />
			</div>
			{children}
		</div>
	);
}
