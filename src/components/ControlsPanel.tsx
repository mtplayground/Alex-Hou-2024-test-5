const CONTROLS = [
  { action: 'Move left', keyLabel: '←' },
  { action: 'Move right', keyLabel: '→' },
  { action: 'Rotate', keyLabel: '↑' },
  { action: 'Soft drop', keyLabel: '↓' },
  { action: 'Hard drop', keyLabel: 'Space' },
  { action: 'Pause', keyLabel: 'P' },
  { action: 'Restart', keyLabel: 'R' },
] as const

export function ControlsPanel() {
  return (
    <section
      aria-label="Controls"
      className="w-full max-w-sm rounded-3xl border border-cyan-400/20 bg-slate-950/80 p-5 text-left shadow-2xl shadow-cyan-950/30"
    >
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-300">
          Controls
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-50">
          Key Bindings
        </h2>
        <p className="mt-2 text-sm text-slate-300">
          Keep this panel beside the board during play for quick reference.
        </p>
      </div>

      <dl className="space-y-3">
        {CONTROLS.map((control) => (
          <div
            key={control.action}
            className="flex items-center justify-between gap-4 rounded-2xl border border-cyan-400/15 bg-slate-900/80 px-4 py-3"
          >
            <dt className="text-sm font-medium text-slate-100">{control.action}</dt>
            <dd className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
              {control.keyLabel}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export default ControlsPanel
