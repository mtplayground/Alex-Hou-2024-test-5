import type { HighScoreEntry } from '../types/game'

export const HIGH_SCORES_STORAGE_KEY = 'tetris.highScores'
export const MAX_HIGH_SCORES = 10

export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

function isValidScore(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
}

function isValidDateString(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.trim().length > 0 &&
    !Number.isNaN(Date.parse(value))
  )
}

function isValidInitials(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function normalizeEntry(entry: HighScoreEntry): HighScoreEntry {
  return {
    achievedAt: new Date(entry.achievedAt).toISOString(),
    initials: entry.initials.trim().toUpperCase().slice(0, 3),
    score: Math.floor(entry.score),
  }
}

function compareEntries(left: HighScoreEntry, right: HighScoreEntry): number {
  if (left.score !== right.score) {
    return right.score - left.score
  }

  if (left.achievedAt !== right.achievedAt) {
    return left.achievedAt.localeCompare(right.achievedAt)
  }

  return left.initials.localeCompare(right.initials)
}

export function isHighScoreEntry(value: unknown): value is HighScoreEntry {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Record<string, unknown>

  return (
    isValidDateString(candidate.achievedAt) &&
    isValidInitials(candidate.initials) &&
    isValidScore(candidate.score)
  )
}

export function normalizeHighScores(entries: HighScoreEntry[]): HighScoreEntry[] {
  return entries
    .map(normalizeEntry)
    .sort(compareEntries)
    .slice(0, MAX_HIGH_SCORES)
}

export function parseHighScores(serialized: string | null): HighScoreEntry[] {
  if (serialized === null) {
    return []
  }

  try {
    const parsed = JSON.parse(serialized) as unknown

    if (!Array.isArray(parsed)) {
      return []
    }

    return normalizeHighScores(parsed.filter(isHighScoreEntry))
  } catch {
    return []
  }
}

export function readHighScores(
  storage: StorageLike,
  storageKey = HIGH_SCORES_STORAGE_KEY
): HighScoreEntry[] {
  return parseHighScores(storage.getItem(storageKey))
}

export function writeHighScores(
  storage: StorageLike,
  entries: HighScoreEntry[],
  storageKey = HIGH_SCORES_STORAGE_KEY
): HighScoreEntry[] {
  const normalizedEntries = normalizeHighScores(entries)

  storage.setItem(storageKey, JSON.stringify(normalizedEntries))

  return normalizedEntries
}

export function addHighScore(
  storage: StorageLike,
  entry: HighScoreEntry,
  storageKey = HIGH_SCORES_STORAGE_KEY
): HighScoreEntry[] {
  return writeHighScores(storage, [...readHighScores(storage, storageKey), entry], storageKey)
}

export function qualifiesForHighScores(
  entries: HighScoreEntry[],
  score: number
): boolean {
  if (!Number.isFinite(score) || score < 0) {
    return false
  }

  if (entries.length < MAX_HIGH_SCORES) {
    return true
  }

  const normalizedEntries = normalizeHighScores(entries)
  const lowestScore = normalizedEntries.at(-1)?.score

  return lowestScore === undefined || score > lowestScore
}
