import type {
  DomainType,
  TeamMemberWithStrengths,
  DomainDistribution,
  TeamAnalytics,
  StrengthWithDomain,
} from "@/lib/types";

/**
 * Group strengths by domain
 */
export function groupStrengthsByDomain(
  strengths: StrengthWithDomain[]
): Record<DomainType, StrengthWithDomain[]> {
  return strengths.reduce(
    (acc, strength) => {
      if (!acc[ strength.domain ]) {
        acc[ strength.domain ] = [];
      }
      acc[ strength.domain ].push(strength);
      return acc;
    },
    {
      Doing: [],
      Feeling: [],
      Motivating: [],
      Thinking: [],
    } as Record<DomainType, StrengthWithDomain[]>
  );
}

/**
 * Calculate domain distribution for a team
 */
export function calculateDomainDistribution(
  teamMembers: TeamMemberWithStrengths[]
): DomainDistribution[] {
  const domainCounts: Record<DomainType, Set<string>> = {
    Doing: new Set(),
    Feeling: new Set(),
    Motivating: new Set(),
    Thinking: new Set(),
  };

  // Count unique members per domain
  teamMembers.forEach((member) => {
    member.strengths.forEach((userStrength) => {
      const domain = userStrength.strength.domain;
      domainCounts[ domain ].add(member.id);
    });
  });

  const totalMembers = teamMembers.length;

  return (Object.keys(domainCounts) as DomainType[]).map((domain) => ({
    domain,
    count: domainCounts[ domain ].size,
    percentage: (domainCounts[ domain ].size / totalMembers) * 100,
    members: Array.from(domainCounts[ domain ]),
  }));
}

/**
 * Identify overused strengths (present in more than threshold% of team)
 */
export function identifyOverusedStrengths(
  teamMembers: TeamMemberWithStrengths[],
  threshold = 60
): TeamAnalytics[ "overusedStrengths" ] {
  const strengthCounts = new Map<
    string,
    { strength: StrengthWithDomain; memberIds: string[] }
  >();

  // Count occurrences of each strength
  teamMembers.forEach((member) => {
    member.strengths.forEach((userStrength) => {
      const strengthId = userStrength.strength.id;
      if (!strengthCounts.has(strengthId)) {
        strengthCounts.set(strengthId, {
          strength: userStrength.strength,
          memberIds: [],
        });
      }
      strengthCounts.get(strengthId)!.memberIds.push(member.id);
    });
  });

  const totalMembers = teamMembers.length;
  const overusedThreshold = (threshold / 100) * totalMembers;

  return Array.from(strengthCounts.values())
    .filter((item) => item.memberIds.length >= overusedThreshold)
    .map((item) => ({
      strength: item.strength,
      count: item.memberIds.length,
      percentage: (item.memberIds.length / totalMembers) * 100,
      memberIds: item.memberIds,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Identify unique strengths (present in less than threshold% of team)
 */
export function identifyUniqueStrengths(
  teamMembers: TeamMemberWithStrengths[],
  threshold = 20
): TeamAnalytics[ "uniqueStrengths" ] {
  const strengthCounts = new Map<
    string,
    { strength: StrengthWithDomain; memberIds: string[]; memberNames: string[] }
  >();

  // Count occurrences of each strength
  teamMembers.forEach((member) => {
    member.strengths.forEach((userStrength) => {
      const strengthId = userStrength.strength.id;
      if (!strengthCounts.has(strengthId)) {
        strengthCounts.set(strengthId, {
          strength: userStrength.strength,
          memberIds: [],
          memberNames: [],
        });
      }
      const data = strengthCounts.get(strengthId)!;
      data.memberIds.push(member.id);
      data.memberNames.push(member.name);
    });
  });

  const totalMembers = teamMembers.length;
  const uniqueThreshold = (threshold / 100) * totalMembers;

  const uniqueStrengths: TeamAnalytics[ "uniqueStrengths" ] = [];

  strengthCounts.forEach((item) => {
    if (item.memberIds.length <= uniqueThreshold && item.memberIds.length > 0) {
      // Add entry for each member who has this unique strength
      item.memberIds.forEach((memberId, index) => {
        uniqueStrengths.push({
          strength: item.strength,
          memberId,
          memberName: item.memberNames[ index ],
        });
      });
    }
  });

  return uniqueStrengths;
}

/**
 * Calculate team analytics
 */
export function calculateTeamAnalytics(
  teamMembers: TeamMemberWithStrengths[]
): TeamAnalytics {
  const domainDistribution = calculateDomainDistribution(teamMembers);
  const overusedStrengths = identifyOverusedStrengths(teamMembers);
  const uniqueStrengths = identifyUniqueStrengths(teamMembers);

  // Find most and least common domains
  const sortedByCount = [ ...domainDistribution ].sort(
    (a, b) => b.count - a.count
  );
  const mostCommon = sortedByCount[ 0 ].domain;
  const leastCommon = sortedByCount[ sortedByCount.length - 1 ].domain;

  // Check if team is balanced (no domain has more than 40% or less than 15%)
  const isBalanced = domainDistribution.every(
    (d) => d.percentage <= 40 && d.percentage >= 15
  );

  return {
    totalMembers: teamMembers.length,
    domainDistribution,
    overusedStrengths,
    uniqueStrengths,
    balance: {
      mostCommon,
      leastCommon,
      isBalanced,
    },
  };
}
