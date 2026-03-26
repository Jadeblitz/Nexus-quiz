const fs = require('fs');

let gameContext = fs.readFileSync('src/context/GameContext.jsx', 'utf8');

const regex = /  const xpPerSubStep = 1250;\n  const stepIndex = Math\.floor\(xp \/ xpPerSubStep\);\n  const rankIndex = Math\.floor\(stepIndex \/ 3\);\n  const subLevelIndex = stepIndex % 3;\n  const subLevels = \["Beginner", "Advanced", "Peak"\];\n\n  const rankName = RANKS\[rankIndex\] \|\| "Basic";\n  const subName = subLevels\[subLevelIndex\] \|\| "Beginner";\n\n  return \{\n    title: \`Rank \$\{rankIndex \+ 1\}\`,\n    level: \`\$\{rankName\} \(\$\{subName\}\)\`,\n    color: rankIndex >= 10 \? "text-rose-500" : rankIndex >= 8 \? "text-purple-400" : "text-blue-400"\n  \};\n\};\n/g;

gameContext = gameContext.replace(regex, '');

fs.writeFileSync('src/context/GameContext.jsx', gameContext);
