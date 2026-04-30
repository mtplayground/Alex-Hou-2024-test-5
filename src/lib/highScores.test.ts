import { describe, expect, it } from 'vitest'
import type { HighScoreEntry } from '../types/game'
import {
  addHighScore,
  HIGH_SCORES_STORAGE_KEY,
  MAX_HIGH_SCORES,
  normalizeHighScores,
  parseHighScores,
  qualifiesForHighScores,
  readHighScores,
  writeHighScores,
  type StorageLike,
} from './highScores'

class MemoryStorage implements StorageLike {
  private readonly values = new Map<string, string>()

  getItem(key: string): string | null {
    return this.values.get(key) ?? null
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value)
  }
}

function createEntry(
  overrides: Partial<HighScoreEntry> = {},
  index = 0
): HighScoreEntry {
  return {
    achievedAt: `2026-01-${String((index % 28) + 1).padStart(2, '0')}T12:00:00.000Z`,
    initials: `p${index}`,
    score: index * 100,
    ...overrides,
  }
}

describe('high score store', () => {
  it('normalizes entries, sorts by score, and limits the list to ten', () => {
    const entries = Array.from({ length: 12 }, (_, index) =>
      createEntry({ score: (12 - index) * 100, initials: `ab${index}` }, index)
    )

    const result = normalizeHighScores(entries)

    expect(result).toHaveLength(MAX_HIGH_SCORES)
    expect(result[0]).toMatchObject({
      initials: 'AB0',
      score: 1200,
    })
    expect(result.at(-1)).toMatchObject({
      initials: 'AB9',
      score: 300,
    })
    expect(result.every((entry) => entry.initials === entry.initials.toUpperCase())).toBe(
      true
    )
  })

  it('returns an empty list for missing or malformed storage values', () => {
    expect(parseHighScores(null)).toEqual([])
    expect(parseHighScores('not-json')).toEqual([])
    expect(parseHighScores(JSON.stringify({ score: 100 }))).toEqual([])
  })

  it('ignores invalid entries while preserving valid ones', () => {
    const result = parseHighScores(
      JSON.stringify([
        createEntry({ initials: 'ok', score: 900 }),
        { initials: '', score: 100, achievedAt: '2026-01-02T12:00:00.000Z' },
        { initials: 'bad', score: -4, achievedAt: '2026-01-03T12:00:00.000Z' },
      ])
    )

    expect(result).toEqual([
      {
        achievedAt: '2026-01-01T12:00:00.000Z',
        initials: 'OK',
        score: 900,
      },
    ])
  })

  it('writes normalized top-ten entries to storage and reads them back', () => {
    const storage = new MemoryStorage()
    const entries = Array.from({ length: 11 }, (_, index) =>
      createEntry({ score: (index + 1) * 125 }, index)
    )

    const writtenEntries = writeHighScores(storage, entries)
    const persistedValue = storage.getItem(HIGH_SCORES_STORAGE_KEY)

    expect(writtenEntries).toHaveLength(MAX_HIGH_SCORES)
    expect(persistedValue).not.toBeNull()
    expect(readHighScores(storage)).toEqual(writtenEntries)
  })

  it('adds a new entry to the stored leaderboard in rank order', () => {
    const storage = new MemoryStorage()

    writeHighScores(storage, [
      createEntry({ initials: 'AAA', score: 400 }, 0),
      createEntry({ initials: 'BBB', score: 200 }, 1),
    ])

    const result = addHighScore(
      storage,
      createEntry({
        achievedAt: '2026-03-01T12:00:00.000Z',
        initials: 'zzz',
        score: 300,
      })
    )

    expect(result.map((entry) => `${entry.initials}:${entry.score}`)).toEqual([
      'AAA:400',
      'ZZZ:300',
      'BBB:200',
    ])
  })

  it('reports whether a score qualifies for the top ten', () => {
    const fullBoard = Array.from({ length: MAX_HIGH_SCORES }, (_, index) =>
      createEntry({ initials: `q${index}`, score: 1000 - index * 100 }, index)
    )

    expect(qualifiesForHighScores([], 0)).toBe(true)
    expect(qualifiesForHighScores(fullBoard, 150)).toBe(true)
    expect(qualifiesForHighScores(fullBoard, 100)).toBe(false)
    expect(qualifiesForHighScores(fullBoard, -1)).toBe(false)
  })
})
