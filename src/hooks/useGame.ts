import { useEffect, useReducer, useRef } from 'react'
import { getGravityIntervalMs } from '../engine/gameplay'
import {
  createInitialGameState,
  gameActions,
  gameReducer,
  type CreateInitialGameStateOptions,
  type GameAction,
} from '../engine/reducer'
import type { GameState } from '../types/game'
import type { RandomNumberGenerator } from '../engine/queue'

export type UseGameOptions = CreateInitialGameStateOptions

export interface UseGameResult {
  actions: typeof gameActions
  dispatch: (action: GameAction) => void
  state: GameState
}

type RandomizedGameAction = Extract<
  GameAction,
  { type: 'HARD_DROP' | 'RESTART' | 'SPAWN' | 'TICK' }
>

function shouldInjectRng(action: GameAction): action is RandomizedGameAction {
  return (
    action.type === 'HARD_DROP' ||
    action.type === 'RESTART' ||
    action.type === 'SPAWN' ||
    action.type === 'TICK'
  )
}

export function useGame(options: UseGameOptions = {}): UseGameResult {
  const rng = options.rng ?? Math.random
  const rngRef = useRef<RandomNumberGenerator>(rng)
  const [state, dispatch] = useReducer(
    gameReducer,
    undefined,
    () => createInitialGameState({ rng })
  )

  useEffect(() => {
    if (state.phase !== 'playing') {
      return
    }

    const intervalId = window.setInterval(() => {
      dispatch(gameActions.tick(rngRef.current))
    }, getGravityIntervalMs(state.level))

    return () => {
      window.clearInterval(intervalId)
    }
  }, [state.level, state.phase])

  function dispatchAction(action: GameAction) {
    if (shouldInjectRng(action) && action.rng === undefined) {
      dispatch({ ...action, rng: rngRef.current })
      return
    }

    dispatch(action)
  }

  return {
    actions: gameActions,
    dispatch: dispatchAction,
    state,
  }
}
