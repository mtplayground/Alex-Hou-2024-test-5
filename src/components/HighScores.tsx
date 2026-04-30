import type { HighScoreEntry } from '../types/game'

export interface HighScoresProps {
  entries: HighScoreEntry[]
}

function formatAchievedAt(value: string): string {
  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export function HighScores({ entries }: HighScoresProps) {
  return (
    <section
      aria-label="High scores"
      className="w-full max-w-sm rounded-3xl border border-cyan-400/20 bg-slate-950/80 p-5 text-left shadow-2xl shadow-cyan-950/30"
    >
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-300">
          Records
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-50">
          Top 10 Runs
        </h2>
        <p className="mt-2 text-sm text-slate-300">
          Highest scores stored on this device.
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-cyan-400/20 bg-slate-900/60 px-4 py-8 text-center text-sm text-slate-300">
          No scores recorded yet. Finish a run to claim the first spot.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-cyan-400/15 bg-slate-900/80">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-cyan-400/15 text-xs uppercase tracking-[0.18em] text-cyan-300">
                <th className="px-4 py-3 text-left font-semibold">Rank</th>
                <th className="px-4 py-3 text-left font-semibold">Player</th>
                <th className="px-4 py-3 text-right font-semibold">Score</th>
                <th className="px-4 py-3 text-right font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr
                  key={`${entry.initials}-${entry.score}-${entry.achievedAt}`}
                  className="border-b border-cyan-400/10 last:border-b-0"
                >
                  <td className="px-4 py-3 text-sm font-semibold text-cyan-200">
                    #{index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-100">
                    {entry.initials}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-slate-50">
                    {entry.score.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-slate-300">
                    {formatAchievedAt(entry.achievedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default HighScores
