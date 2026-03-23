import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { handleShare } from './shareUtils';

describe('shareUtils handleShare clipboard fallback', () => {
  beforeEach(() => {
    vi.stubGlobal('alert', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should use clipboard fallback when navigator.share is unavailable', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', {
      share: undefined,
      clipboard: {
        writeText: writeTextMock,
      },
    });

    const mockRankData = { title: 'Rank 1', level: 'Basic (Beginner)' };
    const mockStreak = 10;
    const mockTotalXp = 1000;

    await handleShare(mockRankData, mockStreak, mockTotalXp);

    expect(writeTextMock).toHaveBeenCalled();
    const callArgs = writeTextMock.mock.calls[0][0];
    expect(callArgs).toContain('I just reached Rank 1: Basic (Beginner) on NexusQuiz!');
    expect(callArgs).toContain('🔥 Max Streak: 10');
    expect(callArgs).toContain('✨ Total XP: 1000');
    expect(global.alert).toHaveBeenCalledWith('Score copied to clipboard!');
  });

  it('should use navigator.share when available', async () => {
    const shareMock = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', {
      share: shareMock,
    });

    const mockRankData = { title: 'Rank 2', level: 'Novice' };
    await handleShare(mockRankData, 0, 1500);

    expect(shareMock).toHaveBeenCalled();
    const callArgs = shareMock.mock.calls[0][0];
    expect(callArgs.title).toBe('NexusQuiz Achievement');
    expect(callArgs.text).toContain('I just reached Rank 2: Novice on NexusQuiz!');
    expect(global.alert).not.toHaveBeenCalled();
  });
});
