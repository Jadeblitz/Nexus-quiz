import '@testing-library/jest-dom';

// Mock HTMLMediaElement
window.HTMLMediaElement.prototype.play = () => Promise.resolve();
window.HTMLMediaElement.prototype.pause = () => {};
// Mock window.scrollTo
window.scrollTo = vi.fn();
