import React from 'react';
import { renderToString } from 'react-dom/server';
import HubMenu from './src/components/HubMenu.jsx';
import { GameContext } from './src/context/GameContext.jsx';

const mockContext = {
  user: { isAdmin: false },
  isAdmin: false,
  stats: { totalXp: 50000, passes: {} },
  gameState: 'subject_select',
  setGameState: () => {},
  selectedSubject: null,
  setSelectedSubject: () => {},
  selectedDifficulty: null,
  setSelectedDifficulty: () => {},
  startQuiz: () => {}
};

const runBenchmark = () => {
  const iterations = 50000;

  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    renderToString(
      <GameContext.Provider value={mockContext}>
        <HubMenu />
      </GameContext.Provider>
    );
  }
  const end = performance.now();

  console.log(`Rendered ${iterations} times in ${(end - start).toFixed(2)} ms`);
};

runBenchmark();
