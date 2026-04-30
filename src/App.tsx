import { APP_TITLE } from './config/env'

function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-16 text-center text-slate-50">
      <div className="w-full max-w-2xl rounded-3xl border border-cyan-400/30 bg-slate-900/80 p-10 shadow-2xl shadow-cyan-950/40">
        <span className="inline-flex rounded-full bg-cyan-400 px-3 py-1 text-sm font-semibold uppercase tracking-[0.2em] text-slate-950">
          Tailwind Ready
        </span>
        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
          {APP_TITLE}
        </h1>
        <p className="mt-4 text-lg text-slate-300">
          Vite, React, TypeScript, and Tailwind CSS are initialized.
        </p>
      </div>
    </main>
  )
}

export default App
