export const handleShare = async (rankData, streak, totalXp) => {
  const streakMsg = streak >= 5 ? `🔥 Max Streak: ${streak}` : '';
  const shareText = `I just reached ${rankData.title}: ${rankData.level} on NexusQuiz! 🏆\n${streakMsg}\n✨ Total XP: ${totalXp}\n\nCan you beat an Engineering Legend? #NexusQuiz #Ordverse`;

  if (navigator.share) {
    try {
      await navigator.share({ title: 'NexusQuiz Achievement', text: shareText });
    } catch (err) {
      console.log("Cancelled");
    }
  } else {
    await navigator.clipboard.writeText(shareText);
    alert("Score copied to clipboard!");
  }
};
