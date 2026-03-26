1. Update `getRank`: 13 tiers max.
    RANKS = ["Basic", "Novice", "Adept", "Elite", "Veteran", "Commander", "Knight", "King", "Emperor", "Saint", "Sage", "Primordial", "God"];
    Length = 13.
    Max Rank = Rank 13 (God).
    Rank 14 = True God, reserved for Nichothéos.

2. Gatekeeping:
    We need a system to save/load number of passes.
    Since `stats.completed` isn't very detailed, let's add `stats.passes` as a map: `{ [subjectId_difficultyId]: count }`.
    In `handleUserPersistence`, load `data.passes || {}`.
    In `saveProgress`, save `passes: newStats.passes`.

    A "Pass" is >= 70% (7/10 or 14/20).
    Intermediate unlocked if `stats.passes[\`${subjectId}_foundational\`] >= 5` (let's say 5).
    Advanced unlocked if `stats.passes[\`${subjectId}_intermediate\`] >= 5`.
    Update `HubMenu.jsx` to show locks and countdowns.

3. XP & Entropy:
    In `GameContext.jsx`:
    ```javascript
    let basePerQuestion = 10;
    if (selectedDifficulty.id === 'intermediate') {
        if (selectedSubject.id === 'lore') basePerQuestion = 30;
        else if (selectedSubject.id === 'tech') basePerQuestion = 20;
        else basePerQuestion = 15;
    } else if (selectedDifficulty.id === 'advanced') {
        if (selectedSubject.id === 'lore') basePerQuestion = 50;
        else if (selectedSubject.id === 'tech') basePerQuestion = 30;
        else basePerQuestion = 20;
    }
    ```
    For advanced, entropy = basePerQuestion / 2. (Wrong answers subtract this amount).
    We can calculate it either on the fly in `handleAnswer` or simply at the end in `finishQuiz`.
    Currently `handleAnswer` increments `score`. We can also track `xpEarned` state. Let's add `sessionXp` to state.
    Or wait, streak bonuses are added mid-game. Let's add `sessionXp` and `sessionResultXp` for final grading screen.

4. Grading:
    Results screen (`QuizEngine.jsx`):
    - Show Pass/Average/Fair/Failed based on percentage.
    - Show +XP earned or -XP lost.
    - Use the specified colors.
