export const getRank = (xp, isAdmin = false) => {
  const RANKS = ["Basic", "Novice", "Adept", "Elite", "Veteran", "Commander", "Knight", "King", "Emperor", "Saint", "Sage", "Primordial", "God"];

  if (xp >= 13 * 3 * 1250) {
      // True God is reserved
      if (isAdmin) {
          return { title: "Rank 14", level: "True God", color: "text-amber-400 font-black" };
      }
      // Non-admins cap at Rank 13 Peak (God)
      return { title: "Rank 13", level: "God (Peak)", color: "text-rose-500" };
  }

  const xpPerSubStep = 1250;
  const stepIndex = Math.floor((xp < 0 ? 0 : xp) / xpPerSubStep);
  // Cap rank at 13 (index 12)
  const rankIndex = Math.min(Math.floor(stepIndex / 3), 12);
  const subLevelIndex = Math.min(stepIndex % 3, 2);
  const subLevels = ["Beginner", "Advanced", "Peak"];

  const rankName = RANKS[rankIndex] || "Basic";
  const subName = subLevels[subLevelIndex] || "Beginner";

  return {
    title: `Rank ${rankIndex + 1}`,
    level: `${rankName} (${subName})`,
    color: rankIndex >= 11 ? "text-rose-500" : rankIndex >= 8 ? "text-purple-400" : "text-blue-400"
  };
};