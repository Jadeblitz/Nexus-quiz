export const getRank = (xp) => {
  const RANKS = ["Basic", "Advanced Rank", "Elite", "Veteran", "Commander", "Knight", "King", "Emperor", "Saint", "Sage", "Primordial", "Progenitor", "God"];
  if (xp >= 50000) return { title: "Rank 14", level: "True God", color: "text-amber-400 font-black" };

  const xpPerSubStep = 1250;
  const stepIndex = Math.floor(xp / xpPerSubStep);
  const rankIndex = Math.floor(stepIndex / 3);
  const subLevelIndex = stepIndex % 3;
  const subLevels = ["Beginner", "Advanced", "Peak"];

  const rankName = RANKS[rankIndex] || "Basic";
  const subName = subLevels[subLevelIndex] || "Beginner";

  return {
    title: `Rank ${rankIndex + 1}`,
    level: `${rankName} (${subName})`,
    color: rankIndex >= 10 ? "text-rose-500" : rankIndex >= 8 ? "text-purple-400" : "text-blue-400"
  };
};
