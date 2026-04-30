import { useMemo, useState } from 'react'
import {
  addHighScore,
  qualifiesForHighScores,
  readHighScores,
  type StorageLike,
} from '../lib/highScores'
import type { HighScoreEntry } from '../types/game'

export interface GameOverModalProps {
  highScoreStorage?: StorageLike
  finalScore: number
  onHighScoresSaved?: (entries: HighScoreEntry[]) => void
  onPlayAgain: () => void
  visible: boolean
}

export function GameOverModal({
  finalScore,
  highScoreStorage,
  onHighScoresSaved,
  onPlayAgain,
  visible,
}: GameOverModalProps) {
  const [initials, setInitials] = useState('')
  const [savedScore, setSavedScore] = useState<number | null>(null)
  const existingEntries = useMemo(
    () => (highScoreStorage ? readHighScores(highScoreStorage) : []),
    [highScoreStorage]
  )
  const shouldPromptForInitials =
    visible &&
    highScoreStorage !== undefined &&
    savedScore !== finalScore &&
    qualifiesForHighScores(existingEntries, finalScore)

  function handleInitialsSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (highScoreStorage === undefined) {
      return
    }

    const sanitizedInitials = initials.replace(/[^a-z]/gi, '').toUpperCase().slice(0, 3)

    if (sanitizedInitials.length !== 3) {
      return
    }

    const entries = addHighScore(highScoreStorage, {
      achievedAt: new Date().toISOString(),
      initials: sanitizedInitials,
      score: finalScore,
    })

    setInitials(sanitizedInitials)
    setSavedScore(finalScore)
    onHighScoresSaved?.(entries)
  }

  function handlePlayAgain() {
    setInitials('')
    setSavedScore(null)
    onPlayAgain()
  }

  if (!visible) {
    return null
  }

  return (
    <div
      aria-label="Game over"
      className="absolute inset-0 flex items-center justify-center rounded-[inherit] bg-slate-950/80 px-4 backdrop-blur-sm"
      role="dialog"
    >
      <div className="w-full max-w-sm rounded-3xl border border-rose-400/20 bg-slate-900/90 p-6 text-center shadow-2xl shadow-rose-950/25">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-300">
          Run Complete
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-50">
          Game Over
        </h2>
        <p className="mt-4 text-sm text-slate-300">Final score</p>
        <p className="mt-2 text-4xl font-bold tracking-tight text-slate-50">
          {finalScore.toLocaleString()}
        </p>
        {shouldPromptForInitials ? (
          <form className="mt-6 text-left" onSubmit={handleInitialsSubmit}>
            <label
              className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-300"
              htmlFor="high-score-initials"
            >
              New High Score
            </label>
            <p className="mt-2 text-sm text-slate-300">
              Enter three letters to save this run to the local leaderboard.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <input
                id="high-score-initials"
                autoComplete="off"
                className="w-full rounded-2xl border border-cyan-400/20 bg-slate-950/80 px-4 py-3 text-center text-xl font-semibold uppercase tracking-[0.32em] text-slate-50 outline-none transition placeholder:text-slate-500 focus:border-cyan-300"
                maxLength={3}
                onChange={(event) => {
                  setInitials(event.target.value.replace(/[^a-z]/gi, '').toUpperCase())
                }}
                placeholder="AAA"
                value={initials}
              />
              <button
                className="inline-flex shrink-0 items-center justify-center rounded-full bg-amber-300 px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={initials.replace(/[^a-z]/gi, '').length !== 3}
                type="submit"
              >
                Save
              </button>
            </div>
          </form>
        ) : null}
        {visible && savedScore === finalScore ? (
          <p className="mt-6 text-sm font-medium text-emerald-300">
            Score saved to the local top 10.
          </p>
        ) : null}
        <button
          className="mt-6 inline-flex items-center justify-center rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950 transition hover:bg-cyan-300"
          onClick={handlePlayAgain}
          type="button"
        >
          Play Again
        </button>
      </div>
    </div>
  )
}

export default GameOverModal
