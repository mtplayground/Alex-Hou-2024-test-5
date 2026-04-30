import { useEffect, useRef } from 'react'
import type { GameAction } from '../engine/reducer'

const INITIAL_REPEAT_DELAY_MS = 150
const REPEAT_INTERVAL_MS = 50

type RepeatingControl = 'ArrowDown' | 'ArrowLeft' | 'ArrowRight'

export interface KeyboardActions {
  hardDrop: () => GameAction
  moveLeft: () => GameAction
  moveRight: () => GameAction
  restart: () => GameAction
  rotateClockwise: () => GameAction
  softDrop: () => GameAction
  togglePause: () => GameAction
}

export interface UseKeyboardControlsOptions {
  actions: KeyboardActions
  dispatch: (action: GameAction) => void
}

interface RepeaterState {
  intervalId: number | null
  timeoutId: number | null
}

const PREVENT_DEFAULT_KEYS = new Set([
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'KeyP',
  'KeyR',
  'Space',
])

export { INITIAL_REPEAT_DELAY_MS, REPEAT_INTERVAL_MS }

export function useKeyboardControls({
  actions,
  dispatch,
}: UseKeyboardControlsOptions): void {
  const actionsRef = useRef(actions)
  const dispatchRef = useRef(dispatch)
  const repeatersRef = useRef<Record<RepeatingControl, RepeaterState>>({
    ArrowDown: { intervalId: null, timeoutId: null },
    ArrowLeft: { intervalId: null, timeoutId: null },
    ArrowRight: { intervalId: null, timeoutId: null },
  })

  useEffect(() => {
    actionsRef.current = actions
    dispatchRef.current = dispatch
  }, [actions, dispatch])

  useEffect(() => {
    function runRepeatingAction(code: RepeatingControl) {
      switch (code) {
        case 'ArrowLeft':
          dispatchRef.current(actionsRef.current.moveLeft())
          break
        case 'ArrowRight':
          dispatchRef.current(actionsRef.current.moveRight())
          break
        case 'ArrowDown':
          dispatchRef.current(actionsRef.current.softDrop())
          break
      }
    }

    function stopRepeater(code: RepeatingControl) {
      const repeater = repeatersRef.current[code]

      if (repeater.timeoutId !== null) {
        window.clearTimeout(repeater.timeoutId)
        repeater.timeoutId = null
      }

      if (repeater.intervalId !== null) {
        window.clearInterval(repeater.intervalId)
        repeater.intervalId = null
      }
    }

    function startRepeater(code: RepeatingControl) {
      const repeater = repeatersRef.current[code]

      if (repeater.timeoutId !== null || repeater.intervalId !== null) {
        return
      }

      runRepeatingAction(code)

      repeater.timeoutId = window.setTimeout(() => {
        repeater.timeoutId = null
        repeater.intervalId = window.setInterval(() => {
          runRepeatingAction(code)
        }, REPEAT_INTERVAL_MS)
      }, INITIAL_REPEAT_DELAY_MS)
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (PREVENT_DEFAULT_KEYS.has(event.code)) {
        event.preventDefault()
      }

      switch (event.code) {
        case 'ArrowLeft':
        case 'ArrowRight':
        case 'ArrowDown':
          startRepeater(event.code)
          return
        case 'ArrowUp':
          if (!event.repeat) {
            dispatchRef.current(actionsRef.current.rotateClockwise())
          }
          return
        case 'Space':
          if (!event.repeat) {
            dispatchRef.current(actionsRef.current.hardDrop())
          }
          return
        case 'KeyP':
          if (!event.repeat) {
            dispatchRef.current(actionsRef.current.togglePause())
          }
          return
        case 'KeyR':
          if (!event.repeat) {
            dispatchRef.current(actionsRef.current.restart())
          }
          return
      }
    }

    function stopAllRepeaters() {
      stopRepeater('ArrowLeft')
      stopRepeater('ArrowRight')
      stopRepeater('ArrowDown')
    }

    function handleKeyUp(event: KeyboardEvent) {
      if (
        event.code === 'ArrowLeft' ||
        event.code === 'ArrowRight' ||
        event.code === 'ArrowDown'
      ) {
        stopRepeater(event.code)
      }
    }

    window.addEventListener('blur', stopAllRepeaters)
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('blur', stopAllRepeaters)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      stopAllRepeaters()
    }
  }, [])
}

export default useKeyboardControls
