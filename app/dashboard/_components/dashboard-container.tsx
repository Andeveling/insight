export default function DashboardContainer({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  userName?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl lg:text-6xl font-bold tracking-tight">
          {title}
        </h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}
