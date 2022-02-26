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

export function* moveSaga(params: {
  //! moveSaga executes inside an infinite loop
  type: string //! Once a direction is given it starts dispatching the same action until
  payload: ISnakeCoord //! It starts dispatching a new action until a new action  (i.e direction)
}): Generator<
  //! is given with yield put({type:.....payload:params.payload})
  | PutEffect<{ type: string; payload: ISnakeCoord }>
  | PutEffect<{ type: string; payload: string }> //! once action is dispatched we need to se disallowed direction
  | CallEffect<true> //! in the opposite direction to avoid snake biting itself
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
