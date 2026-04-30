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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(94,228,255,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(255,159,92,0.14),_transparent_24%),linear-gradient(180deg,_#020617,_#0f172a)] px-4 py-6 text-slate-50 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 lg:gap-8">
        <header className="flex flex-col gap-5 rounded-[2rem] border border-cyan-300/15 bg-slate-950/70 p-5 shadow-2xl shadow-cyan-950/20 sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:p-7">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-cyan-200">
              Arcade Stack
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-50 sm:text-5xl xl:text-6xl">
              {APP_TITLE}
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base xl:text-lg">
              Start a run, pause without reloading, and keep the local leaderboard updated.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              className="inline-flex min-w-[11rem] items-center justify-center rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950 transition hover:bg-cyan-200"
              onClick={handleStartGame}
              type="button"
            >
              {screen === 'playing' ? 'Restart Run' : 'Start Game'}
            </button>
            <button
              className="inline-flex min-w-[11rem] items-center justify-center rounded-full border border-cyan-300/20 bg-slate-950/60 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-100 transition hover:border-cyan-200 hover:text-cyan-100"
              onClick={handleViewHighScores}
              type="button"
            >
              High Scores
            </button>
          </div>
        </header>

        {screen === 'start' ? (
          <section className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,420px)]">
            <div className="rounded-[2rem] border border-cyan-300/15 bg-slate-950/75 p-6 shadow-2xl shadow-cyan-950/25 sm:p-8 xl:p-10">
              <span className="inline-flex rounded-full bg-cyan-300 px-3 py-1 text-sm font-semibold uppercase tracking-[0.2em] text-slate-950">
                Ready
              </span>
              <h2 className="mt-6 text-3xl font-black tracking-tight text-slate-50 sm:text-4xl xl:text-5xl">
                Drop in when you&apos;re ready.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 xl:text-lg">
                Start a fresh board, play with keyboard controls, and save a local high score
                when your run breaks into the top 10.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                  className="inline-flex min-w-[11rem] items-center justify-center rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950 transition hover:bg-cyan-200"
                  onClick={handleStartGame}
                  type="button"
                >
                  Start Run
                </button>
                <button
                  className="inline-flex min-w-[11rem] items-center justify-center rounded-full border border-slate-600 bg-slate-950/60 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-100 transition hover:border-cyan-300 hover:text-cyan-200"
                  onClick={handleViewHighScores}
                  type="button"
                >
                  View Leaderboard
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-6 xl:sticky xl:top-6">
              <ControlsPanel className="max-w-none" />
              <HighScores className="max-w-none" entries={highScores} />
            </div>
          </section>
        ) : null}

        {screen === 'playing' ? (
          <section className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,400px)] xl:gap-8">
            <div className="flex justify-center xl:justify-start">
              <div className="relative w-full max-w-[22rem] rounded-[2rem] border border-cyan-300/15 bg-slate-950/80 p-3 shadow-2xl shadow-cyan-950/30 sm:max-w-[24rem] sm:p-4 xl:max-w-[28rem] xl:p-5">
                <BoardCanvas
                  activePiece={state.activePiece}
                  board={state.board}
                  cellSize={34}
                  className="block h-auto w-full rounded-[1.35rem]"
                />
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
                className="max-w-none"
                level={state.level}
                linesCleared={state.linesCleared}
                score={state.score}
              />
              <section className="w-full rounded-3xl border border-cyan-300/15 bg-slate-950/80 p-5 text-left shadow-2xl shadow-cyan-950/30">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-300">
                  Queue
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-50">
                  Next Piece
                </h2>
                <div className="mt-5 flex justify-center rounded-2xl border border-cyan-300/15 bg-slate-900/80 p-4 sm:justify-start">
                  <NextPiece
                    className="h-auto w-[96px] sm:w-[112px]"
                    tetrominoType={nextPiece}
                  />
                </div>
              </section>
              <ControlsPanel className="max-w-none" />
            </div>
          </section>
        ) : null}

        {screen === 'highScores' ? (
          <section className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,380px)]">
            <HighScores className="max-w-none" entries={highScores} />
            <div className="flex flex-col gap-6">
              <ControlsPanel className="max-w-none" />
              <section className="rounded-3xl border border-cyan-300/15 bg-slate-950/80 p-6 text-left shadow-2xl shadow-cyan-950/30">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-300">
                  Navigation
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-50">
                  What next?
                </h2>
                <p className="mt-3 text-sm text-slate-300">
                  Jump back to the start screen or launch another run immediately.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row xl:flex-col">
                  <button
                    className="inline-flex items-center justify-center rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950 transition hover:bg-cyan-200"
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
