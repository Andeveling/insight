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
		<div className="space-y-4 container *:mx-auto">
			<div>
				<div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
					<h1 className="text-2xl lg:text-4xl font-bold tracking-tight">
						{title}
					</h1>
					{card && <div className="mt-4">{card}</div>}
				</div>
				<p className="text-muted-foreground">{description}</p>
			</div>
			{children}
		</div>
	);
}
