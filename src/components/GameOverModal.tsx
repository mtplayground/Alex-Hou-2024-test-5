export interface GameOverModalProps {
  finalScore: number
  onPlayAgain: () => void
  visible: boolean
}

export function GameOverModal({
  finalScore,
  onPlayAgain,
  visible,
}: GameOverModalProps) {
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
        <button
          className="mt-6 inline-flex items-center justify-center rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950 transition hover:bg-cyan-300"
          onClick={onPlayAgain}
          type="button"
        >
          Play Again
        </button>
      </div>
    </div>
  )
}

export default GameOverModal
