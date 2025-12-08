import { FileTextIcon, SparklesIcon, UserIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ReportsPage() {
  return (
    <div className="container mx-auto space-y-8 py-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Reports</h1>
        <p className="text-muted-foreground">
          Generate comprehensive AI-powered reports based on strengths
          assessment data. Reports include actionable insights, blind spots, and
          development strategies.
        </p>
      </div>

      {/* Report Types */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Individual Reports */}
        <Card className="relative overflow-hidden">
          <div className="absolute right-0 top-0 size-32 -translate-y-8 translate-x-8 rounded-full bg-primary/10" />
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                <UserIcon className="size-6 text-primary" />
              </div>
              <div>
                <CardTitle>Individual Reports</CardTitle>
                <CardDescription>Personal strength analysis</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Get personalized insights about your top 5 strengths including:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <SparklesIcon className="size-4 text-primary" />
                Career implications and ideal roles
              </li>
              <li className="flex items-center gap-2">
                <SparklesIcon className="size-4 text-primary" />
                Blind spots and dark sides to address
              </li>
              <li className="flex items-center gap-2">
                <SparklesIcon className="size-4 text-primary" />
                How your strengths work together
              </li>
              <li className="flex items-center gap-2">
                <SparklesIcon className="size-4 text-primary" />
                Development strategies
              </li>
              <li className="flex items-center gap-2">
                <SparklesIcon className="size-4 text-primary" />
                Best partnership strengths
              </li>
            </ul>
            <Button asChild className="w-full">
              <Link href="/dashboard/reports/individual">
                <FileTextIcon className="mr-2 size-4" />
                View My Report
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Team Reports */}
        <Card className="relative overflow-hidden">
          <div className="absolute right-0 top-0 size-32 -translate-y-8 translate-x-8 rounded-full bg-blue-500/10" />
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-lg bg-blue-500/10">
                <UsersIcon className="size-6 text-blue-500" />
              </div>
              <div>
                <CardTitle>Team Reports</CardTitle>
                <CardDescription>Team composition analysis</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Comprehensive team assessment including:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <SparklesIcon className="size-4 text-blue-500" />
                Team culture map (2x2 matrix)
              </li>
              <li className="flex items-center gap-2">
                <SparklesIcon className="size-4 text-blue-500" />
                Domain coverage analysis
              </li>
              <li className="flex items-center gap-2">
                <SparklesIcon className="size-4 text-blue-500" />
                Strengths distribution
              </li>
              <li className="flex items-center gap-2">
                <SparklesIcon className="size-4 text-blue-500" />
                Member synergies and gaps
              </li>
              <li className="flex items-center gap-2">
                <SparklesIcon className="size-4 text-blue-500" />
                Role optimization suggestions
              </li>
            </ul>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/reports/team">
                <FileTextIcon className="mr-2 size-4" />
                View Team Report
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Info Section */}
      <Card className="border-dashed">
        <CardContent className="flex items-center gap-4 py-6">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <SparklesIcon className="size-6 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="font-medium">Cómo funciona</p>
            <p className="text-sm text-muted-foreground">
              Los reportes se generan con IA basándose en tu perfil de
              fortalezas y composición del equipo. Usamos GPT-4o de OpenAI para
              análisis comprehensivos. Los reportes se guardan en caché y solo
              puedes regenerarlos cada 30 días o si cambian tus fortalezas.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
