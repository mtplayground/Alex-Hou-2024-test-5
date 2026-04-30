import { useEffect, useState } from 'react'
import BoardCanvas from './components/BoardCanvas'
import ControlsPanel from './components/ControlsPanel'
import GameOverModal from './components/GameOverModal'
import HighScores from './components/HighScores'
import Hud from './components/Hud'
import NextPiece from './components/NextPiece'
import PauseOverlay from './components/PauseOverlay'
import { APP_TITLE } from './config/env'
import { readHighScores } from './lib/highScores'
import { useGame } from './hooks/useGame'
import { useKeyboardControls } from './hooks/useKeyboardControls'

type AppScreen = 'highScores' | 'playing' | 'start'

function readInitialHighScores() {
  if (typeof window === 'undefined') {
    return []
  }

  return readHighScores(window.localStorage)
}

function App() {
  const { actions, dispatch, state } = useGame()
  const [screen, setScreen] = useState<AppScreen>('start')
  const [highScores, setHighScores] = useState(readInitialHighScores)
  const nextPiece = state.queue[0] ?? 'I'
  const isPlayingScreen = screen === 'playing'
  const isGameOver = isPlayingScreen && state.phase === 'gameOver'

  useKeyboardControls({
    actions,
    dispatch,
    enabled: isPlayingScreen && state.phase !== 'gameOver',
  })

  useEffect(() => {
    if (screen === 'playing') {
      if (state.phase === 'paused') {
        dispatch(actions.togglePause())
      }

      return
    }

    if (state.phase === 'playing') {
      dispatch(actions.togglePause())
    }
  }, [actions, dispatch, screen, state.phase])

  function handleStartGame() {
    dispatch(actions.restart())
    setScreen('playing')
  }

  function handlePlayAgain() {
    dispatch(actions.restart())
    setScreen('playing')
  }

  function handleViewHighScores() {
    setHighScores(readInitialHighScores())
    setScreen('highScores')
  }

  function handleReturnToStart() {
    setScreen('start')
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_32%),linear-gradient(180deg,_#020617,_#111827)] px-6 py-10 text-slate-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-col gap-4 rounded-3xl border border-cyan-400/20 bg-slate-950/70 p-6 shadow-2xl shadow-cyan-950/20 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
              Arcade Stack
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl">
              {APP_TITLE}
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
              Start a run, pause without reloading, and keep the local leaderboard updated.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950 transition hover:bg-cyan-300"
              onClick={handleStartGame}
              type="button"
            >
              {screen === 'playing' ? 'Restart Run' : 'Start Game'}
            </button>
            <button
              className="inline-flex items-center justify-center rounded-full border border-cyan-400/20 bg-slate-950/60 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-100 transition hover:border-cyan-300 hover:text-cyan-200"
              onClick={handleViewHighScores}
              type="button"
            >
              High Scores
            </button>
          </div>
        </header>

        {screen === 'start' ? (
          <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="rounded-3xl border border-cyan-400/20 bg-slate-950/75 p-8 shadow-2xl shadow-cyan-950/25">
              <span className="inline-flex rounded-full bg-cyan-400 px-3 py-1 text-sm font-semibold uppercase tracking-[0.2em] text-slate-950">
                Ready
              </span>
              <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
                Drop in when you&apos;re ready.
              </h2>
              <p className="mt-4 max-w-2xl text-base text-slate-300">
                Start a fresh board, play with keyboard controls, and save a local high score
                when your run breaks into the top 10.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950 transition hover:bg-cyan-300"
                  onClick={handleStartGame}
                  type="button"
                >
                  Start Run
                </button>
                <button
                  className="inline-flex items-center justify-center rounded-full border border-slate-600 bg-slate-950/60 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-100 transition hover:border-cyan-300 hover:text-cyan-200"
                  onClick={handleViewHighScores}
                  type="button"
                >
                  View Leaderboard
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <ControlsPanel />
              <HighScores entries={highScores} />
            </div>
          </section>
        ) : null}

        {screen === 'playing' ? (
          <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(340px,420px)]">
            <div className="flex justify-center">
              <div className="relative rounded-[2rem] border border-cyan-400/20 bg-slate-950/80 p-4 shadow-2xl shadow-cyan-950/30">
                <BoardCanvas activePiece={state.activePiece} board={state.board} />
                <PauseOverlay visible={state.phase === 'paused'} />
                <GameOverModal
                  finalScore={state.score}
                  highScoreStorage={typeof window === 'undefined' ? undefined : window.localStorage}
                  onHighScoresSaved={setHighScores}
                  onPlayAgain={handlePlayAgain}
                  onViewHighScores={handleViewHighScores}
                  visible={isGameOver}
                />
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <Hud
                level={state.level}
                linesCleared={state.linesCleared}
                score={state.score}
              />
              <section className="w-full max-w-sm rounded-3xl border border-cyan-400/20 bg-slate-950/80 p-5 text-left shadow-2xl shadow-cyan-950/30">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-300">
                  Queue
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-50">
                  Next Piece
                </h2>
                <div className="mt-5 flex justify-center rounded-2xl border border-cyan-400/15 bg-slate-900/80 p-4">
                  <NextPiece tetrominoType={nextPiece} />
                </div>
              </section>
              <ControlsPanel />
            </div>
          </section>
        ) : null}

        {screen === 'highScores' ? (
          <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            <HighScores entries={highScores} />
            <div className="flex flex-col gap-6">
              <ControlsPanel />
              <section className="rounded-3xl border border-cyan-400/20 bg-slate-950/80 p-6 text-left shadow-2xl shadow-cyan-950/30">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-300">
                  Navigation
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-50">
                  What next?
                </h2>
                <p className="mt-3 text-sm text-slate-300">
                  Jump back to the start screen or launch another run immediately.
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  <button
                    className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950 transition hover:bg-cyan-300"
                    onClick={handleStartGame}
                    type="button"
                  >
                    Start New Run
                  </button>
                  <button
                    className="inline-flex items-center justify-center rounded-full border border-slate-600 bg-slate-950/60 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-100 transition hover:border-cyan-300 hover:text-cyan-200"
                    onClick={handleReturnToStart}
                    type="button"
                  >
                    Back To Start
                  </button>
                </div>
              </section>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  )
}

export default App
