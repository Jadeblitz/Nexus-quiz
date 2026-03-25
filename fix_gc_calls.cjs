const fs = require('fs');
let gc = fs.readFileSync('src/context/GameContext.jsx', 'utf8');

// Update `getRank(newXp)` calls to pass `user?.uid`
gc = gc.replace(/getRank\(newXp\)/g, 'getRank(newXp, user?.uid)');
gc = gc.replace(/getRank\(stats\.totalXp\)/g, 'getRank(stats.totalXp, user?.uid)');

fs.writeFileSync('src/context/GameContext.jsx', gc);
