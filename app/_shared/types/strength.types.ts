/**
 * Domain types for strengths classification
 */
export type DomainType = "Doing" | "Feeling" | "Motivating" | "Thinking";

/**
 * Strength with domain information
 */
export interface StrengthWithDomain {
  id: string;
  name: string;
  nameEs: string;
  domain: DomainType;
  briefDefinition: string;
  fullDefinition: string;
  howToUseMoreEffectively?: string[];
  watchOuts?: string[];
  strengthsDynamics?: string;
  bestPartners?: string[];
  careerApplications?: string[];
}

/**
 * User strength with ranking
 */
export interface UserStrengthRanked {
  strengthId: string;
  strength: StrengthWithDomain;
  rank: number; // 1-5
}

/**
 * Team member with their strengths
 */
export interface TeamMemberWithStrengths {
  id: string;
  name: string;
  email: string;
  image?: string;
  strengths: UserStrengthRanked[];
}

/**
 * Domain distribution for team analytics
 */
export interface DomainDistribution {
  domain: DomainType;
  count: number;
  percentage: number;
  members: string[]; // member IDs
}

/**
 * Team analytics data
 */
export interface TeamAnalytics {
  totalMembers: number;
  domainDistribution: DomainDistribution[];
  overusedStrengths: Array<{
    strength: StrengthWithDomain;
    count: number;
    percentage: number;
    memberIds: string[];
  }>;
  uniqueStrengths: Array<{
    strength: StrengthWithDomain;
    memberId: string;
    memberName: string;
  }>;
  balance: {
    mostCommon: DomainType;
    leastCommon: DomainType;
    isBalanced: boolean;
  };
}
