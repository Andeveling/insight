export type ProfileAchievement = {
  badgeId: string;
  badgeKey: string;
  nameEs: string;
  descriptionEs: string;
  tier: "bronze" | "silver" | "gold" | "platinum";
  icon: string;
  unlockedAt: string;
};
