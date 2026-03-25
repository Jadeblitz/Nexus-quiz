const fs = require('fs');
let qe = fs.readFileSync('src/components/QuizEngine.jsx', 'utf8');

// Extract user alongside stats
qe = qe.replace(/stats, gameState, setGameState,/, 'user, stats, gameState, setGameState,');

qe = qe.replace(/<p className="font-bold">You<\/p>/g, '<p className="font-bold">{user?.displayName || "Unknown Warrior"}</p>');

fs.writeFileSync('src/components/QuizEngine.jsx', qe);
