import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Strength Assessment | Insight",
  description: "Discover your top 5 strengths with our progressive assessment",
};

export default function AssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-4xl py-6">{children}</div>
    </div>
  );
}
