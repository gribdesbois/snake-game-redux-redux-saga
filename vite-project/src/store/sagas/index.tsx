import {
  CallEffect,
  delay,
  put,
  PutEffect,
  takeLatest,
} from 'redux-saga/effects'

import {
  DOWN,
  ISnakeCoord,
  LEFT,
  MOVE_DOWN,
  MOVE_LEFT,
  MOVE_RIGHT,
  MOVE_UP,
  RESET,
  RIGHT,
  setDisDirection,
  STOP_GAME,
  UP,
} from '../actions'

//! moveSaga executes inside an infinite loop
//! Once a direction is given it starts dispatching the same action until
//! It starts dispatching a new action until a new action  (i.e direction)
//! is given with yield put({type:.....payload:params.payload})
//! once action is dispatched we need to se disallowed direction
//! in the opposite direction to avoid snake biting itself

export function* moveSaga(params: {
  type: string
  payload: ISnakeCoord
}): Generator<
  | PutEffect<{ type: string; payload: ISnakeCoord }>
  | PutEffect<{ type: string; payload: string }>
  | CallEffect<true>
> {
  while (params.type !== RESET && params.type !== STOP_GAME) {
    yield put({
      type: params.type.split('_')[1],
      payload: params.payload,
    })
    switch (params.type.split('_')[1]) {
      case RIGHT:
        yield put(setDisDirection(LEFT))
        break

      case LEFT:
        yield put(setDisDirection(RIGHT))
        break

      case UP:
        yield put(setDisDirection(DOWN))
        break

      case DOWN:
        yield put(setDisDirection(UP))
        break
    }
    yield delay(100)
  }
}

function* watcherSagas() {
  yield takeLatest(
    [MOVE_RIGHT, MOVE_LEFT, MOVE_UP, MOVE_DOWN, RESET, STOP_GAME],
    moveSaga
  )
}

export default watcherSagas
