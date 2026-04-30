export interface PauseOverlayProps {
  visible: boolean
}

export function PauseOverlay({ visible }: PauseOverlayProps) {
  if (!visible) {
    return null
  }

  return (
    <div
      aria-label="Paused"
      className="absolute inset-0 flex items-center justify-center rounded-[inherit] bg-slate-950/70 backdrop-blur-sm"
      role="status"
    >
      <div className="rounded-3xl border border-cyan-400/20 bg-slate-900/85 px-8 py-6 text-center shadow-2xl shadow-cyan-950/30">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
          Paused
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-50">
          Game On Hold
        </h2>
        <p className="mt-3 text-sm text-slate-300">
          Resume when you&apos;re ready to keep stacking.
        </p>
      </div>
    </div>
  )
}

export default PauseOverlay
