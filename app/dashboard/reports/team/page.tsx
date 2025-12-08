import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";
import { TeamReportView } from "./team-report-view";

export default async function TeamReportPage() {
  // Get current user session (cached)
  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Get user's team membership
  const teamMember = await prisma.teamMember.findFirst({
    where: { userId },
    include: {
      team: {
        include: {
          members: {
            include: {
              user: {
                include: {
                  profile: true,
                  userStrengths: {
                    include: {
                      strength: {
                        include: {
                          domain: true,
                        },
                      },
                    },
                    orderBy: { rank: "asc" },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!teamMember) {
    return (
      <div className="container mx-auto py-8">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-2xl font-bold">No Team Found</h1>
          <p className="mt-2 text-muted-foreground">
            You are not a member of any team. Contact your administrator to be
            added to a team.
          </p>
        </div>
      </div>
    );
  }

  const team = teamMember.team;

  // Get existing report
  const existingReport = await prisma.report.findFirst({
    where: {
      teamId: team.id,
      type: "TEAM_FULL",
      status: "COMPLETED",
    },
    orderBy: { version: "desc" },
  });

  // Parse report content if exists
  const reportContent = existingReport?.content
    ? JSON.parse(existingReport.content)
    : null;

  const reportMetadata = existingReport?.metadata
    ? JSON.parse(existingReport.metadata)
    : null;

  // Check if team members have strengths
  const membersWithStrengths = team.members.filter(
    (m) => m.user.userStrengths.length > 0
  );

  return (
    <TeamReportView
      team={{
        id: team.id,
        name: team.name,
        description: team.description,
        members: team.members.map((m) => ({
          id: m.user.id,
          name: m.user.name,
          role: m.role,
          career: m.user.profile?.career ?? null,
          hasStrengths: m.user.userStrengths.length > 0,
          strengths: m.user.userStrengths.map((us) => ({
            rank: us.rank,
            name: us.strength.name,
            domain: us.strength.domain.name,
          })),
        })),
      }}
      membersWithStrengthsCount={membersWithStrengths.length}
      existingReport={
        existingReport
          ? {
              id: existingReport.id,
              version: existingReport.version,
              createdAt: existingReport.createdAt,
              modelUsed: existingReport.modelUsed,
              content: reportContent,
              metadata: reportMetadata,
            }
          : null
      }
    />
  );
}
