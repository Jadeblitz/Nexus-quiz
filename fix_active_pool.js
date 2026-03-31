import fs from 'fs';

let content = fs.readFileSync('src/context/GameContext.jsx', 'utf8');

// We need a session-level active pool that persists between quizzes but doesn't persist across page reloads.
// A simple way is to define `const sessionPools = {};` outside the GameProvider or inside it as a ref.
// However, the issue description states: "Once a question is answered, it MUST be removed from the "active pool" for that session so it cannot repeat."
// Wait, the active pool might just mean `quizData` itself for the session, or a new state `activePool`.
// Let's create a ref: `const activePools = useRef({});`
