1. Update `getRank` in `src/context/GameContext.jsx` and `rankEngine.js`/`quizLogic.js`:
   - Change maximum XP boundary. Rank 13 Peak is "God". Rank 14 is "True God" reserved for Nichothéos. Let's make sure it perfectly fits "13-tier ranking system (Basic to God)" with 3 sub-levels each.
   - 13 * 3 = 39 sub-levels. 39 * 1250 = 48750 XP for Rank 13 Peak. Or something similar depending on index math.
   - Let's check `getRank` logic carefully.

2. Progression Gatekeeper (Locking Mechanism):
   - Modify `src/context/GameContext.jsx` to track "Passes" per subject and difficulty. (e.g., `passes: { subjectId: { difficultyId: number } }`). Update `stats` state to include `passes`.
   - Update Firestore `handleUserPersistence` and `saveProgress` to save/load `passes`.
   - In `HubMenu.jsx` for `difficulty_select`:
      - For Intermediate: unlocked if Foundational passes >= 5 (or user-defined).
      - For Advanced: unlocked if Intermediate passes >= 5.
      - Display Lock icon with countdown if locked.
   - Pass Criteria: Update `finishQuiz`. Final percentage >= 70% is a "Pass".

3. XP Economy & Entropy:
   - In `finishQuiz`, calculate base XP based on subject and difficulty.
   - Foundational: 10 XP per correct.
   - Intermediate/Advanced Weighting:
      - Gen Sections (e.g. Science, History, FunFacts, Entertainment, Sports, Languages): Moderate (e.g. 15 XP for Int, 20 XP for Adv).
      - Engineering & Math (tech): Higher (e.g. 20 XP for Int, 30 XP for Adv).
      - Ordverse Lore (lore): Highest (e.g. 30 XP for Int, 50 XP for Adv).
   - Negative Scoring (Advanced Only):
      - Every wrong answer subtracts 50% of what a correct answer would have given.
      - Track wrong answers during the quiz or calculate from final score in `finishQuiz`.
   - Streak Bonus:
      - 5 consecutive wins. Bonus = 50% of the section's base XP or proportional.
   - Prevent `totalXp` from dropping below zero.

4. Grading & Session Telemetry:
   - In `QuizEngine.jsx` `results` state, show Pass, Average, Fair, or Failed based on final percentage.
   - Visual Feedback:
      - Standard Sections: Positive XP = Neon Green, Negative XP = Bright Red.
      - Ordverse Lore: Positive XP = Lustrous Gold, Negative XP = Ominous Purple (#6A0DAD).

5. Test and Pre-commit.
