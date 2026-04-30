export interface HudProps {
  className?: string
  level: number
  linesCleared: number
  score: number
}

interface StatCardProps {
  label: string
  value: number
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-cyan-400/20 bg-slate-900/80 px-4 py-5 shadow-lg shadow-cyan-950/20">
      <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
        {label}
      </dt>
      <dd className="mt-3 text-3xl font-bold tracking-tight text-slate-50">
        {value.toLocaleString()}
      </dd>
    </div>
  )
}

export function Hud({ className, level, linesCleared, score }: HudProps) {
  return (
    <section
      aria-label="Game stats"
      className={`w-full rounded-3xl border border-cyan-400/20 bg-slate-950/80 p-5 text-left shadow-2xl shadow-cyan-950/30 ${className ?? 'max-w-sm'}`}
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-300">
            Status
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-50">
            Current Run
          </h2>
        </div>
        <div className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
          Live
        </div>
      </div>

      <dl className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        <StatCard label="Score" value={score} />
        <StatCard label="Level" value={level} />
        <StatCard label="Lines" value={linesCleared} />
      </dl>
    </section>
  )
}

export default Hud
