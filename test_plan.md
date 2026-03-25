Plan check:
Requirements:
1. Identity & Data Layer
- Rank Capping: Implement a 13-tier ranking system (Basic to God).
- Each rank has 3 sub-levels: [Beginner, Advanced, Peak].
- Hard Cap: Rank 13 Peak (God). Rank 14 True God is Nichothéos.

2. The Progression Gatekeeper
- Difficulty Tiers: Foundational, Intermediate, Advanced.
- Intermediate/Advanced locked until previous difficulty "Passed" e.g., 5 times. Let's make it 5 since prompt says (e.g., 5 or 10).
- Pass Criteria: score >= 70% (7/10 or 14/20).
- UI Feedback: Display Lock icon with countdown "Need [X] more Passes to unlock [Next Difficulty]."

3. The XP Economy & Entropy
- Foundational: 10 XP per correct.
- Intermediate/Advanced Weighting: General Moderate, Engineering/Math Higher, Ordverse Lore Highest.
  - E.g. Foundational: Gen 10, Math 10, Lore 10.
  - E.g. Intermediate: Gen 20, Math 30, Lore 40.
  - E.g. Advanced: Gen 30, Math 40, Lore 50. (or something proportional, let's pick decent values: Gen 15/20, Tech 20/30, Lore 30/50, matching plan2.md).
- Negative Scoring (Advanced Only): Entropy penalty. Wrong answer subtracts 50% of correct answer XP.
- Streak Bonus: Grant bonus for 5 consecutive wins. Proportional to section's base XP. E.g. 5x BaseXP or BaseXP. Prompt: "bonus amount must be proportional to the section's base XP". Let's say `baseXP * 2` or `baseXP * 5`. The old logic gave `50 XP` flat. Let's make it `baseGain * 5`? Or just `baseGain * 5` for a 5 streak? Actually, maybe the "bonus amount" could be equal to 50% of 5x baseXP, or maybe simply `baseGain` (a free question). The prompt says proportional, let's use `baseXP * 2`. Wait, "proportional to the section's base XP" could just mean `baseXP * multiplier` (e.g. `baseXP * 5`). Let's use `baseXP * 5`.

4. Grading & Session Telemetry
- Final percentage grading: Pass (>= 70%), Average (>= 50%?), Fair (>= 30%?), Failed (< 30%?). Let's define the thresholds. e.g., >= 70% Pass, >= 50% Average, >= 30% Fair, < 30% Failed.
- Visual Feedback:
  - Standard Sections: Positive XP = Neon Green, Negative XP = Bright Red.
  - Ordverse Lore: Positive XP = Lustrous Gold, Negative XP = Ominous Purple (#6A0DAD).
- Code Integrity: Ensure totalXP doesn't drop below zero.

Let's request plan review.
