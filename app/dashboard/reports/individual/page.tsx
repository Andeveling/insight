import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";
import { IndividualReportView } from "./individual-report-view";

export default async function IndividualReportPage() {
  // Get current user session (cached)
  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Fetch user with strengths and existing report
  const [user, existingReport] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
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
        teamMembers: {
          include: {
            team: true,
          },
          take: 1,
        },
      },
    }),
    prisma.report.findFirst({
      where: {
        userId,
        type: "INDIVIDUAL_FULL",
        status: "COMPLETED",
      },
      orderBy: { version: "desc" },
    }),
  ]);

  if (!user) {
    redirect("/login");
  }

  // Check if user has strengths
  const hasStrengths = user.userStrengths.length > 0;

  // Parse report content if exists
  const reportContent = existingReport?.content
    ? JSON.parse(existingReport.content)
    : null;

  const reportMetadata = existingReport?.metadata
    ? JSON.parse(existingReport.metadata)
    : null;

  return (
    <IndividualReportView
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        profile: user.profile
          ? {
              career: user.profile.career,
              age: user.profile.age,
              description: user.profile.description,
            }
          : null,
        strengths: user.userStrengths.map((us) => ({
          rank: us.rank,
          name: us.strength.name,
          nameEs: us.strength.nameEs,
          domain: us.strength.domain.name,
        })),
        team: user.teamMembers[0]
          ? {
              name: user.teamMembers[0].team.name,
              role: user.teamMembers[0].role,
            }
          : null,
      }}
      hasStrengths={hasStrengths}
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
