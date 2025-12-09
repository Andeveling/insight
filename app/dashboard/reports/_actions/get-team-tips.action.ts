"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";

export async function getTeamTipsData() {
  const session = await getSession();

  if (!session?.user?.id) {
    return null;
  }

  const userId = session.user.id;

  const user = await prisma.user.findUnique({
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
        take: 1,
      },
    },
  });

  if (!user) {
    return null;
  }

  const hasStrengths = user.userStrengths.length > 0;
  const teamMembership = user.teamMembers[0];
  const team = teamMembership?.team;

  const teammates =
    team?.members
      .filter((m) => m.userId !== userId)
      .filter((m) => m.user.userStrengths.length > 0) ?? [];

  const existingReport = team
    ? await prisma.report.findFirst({
        where: {
          userId,
          teamId: team.id,
          type: "TEAM_TIPS",
          status: "COMPLETED",
        },
        orderBy: { version: "desc" },
      })
    : null;

  const reportContent = existingReport?.content ? JSON.parse(existingReport.content) : null;
  const reportMetadata = existingReport?.metadata ? JSON.parse(existingReport.metadata) : null;

  return {
    user: {
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
    },
    team: team
      ? {
          id: team.id,
          name: team.name,
          description: team.description,
          role: teamMembership.role,
        }
      : null,
    teammates: teammates.map((m) => ({
      id: m.user.id,
      name: m.user.name,
      role: m.role,
      career: m.user.profile?.career ?? null,
      strengths: m.user.userStrengths.map((us) => ({
        rank: us.rank,
        name: us.strength.name,
        nameEs: us.strength.nameEs,
        domain: us.strength.domain.name,
      })),
    })),
    hasStrengths,
    existingReport: existingReport
      ? {
          id: existingReport.id,
          version: existingReport.version,
          createdAt: existingReport.createdAt,
          modelUsed: existingReport.modelUsed,
          content: reportContent,
          metadata: reportMetadata,
        }
      : null,
  };
}
