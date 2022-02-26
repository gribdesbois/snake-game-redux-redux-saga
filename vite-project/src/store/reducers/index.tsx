import {
  DOWN,
  UP,
  LEFT,
  RIGHT,
  SET_DIS_DIRECTION,
  INCREASE_SNAKE,
  INCREMENT_SCORE,
  ISnakeCoord,
} from '../actions'

const GlobalState = {
  data: '',
}

export interface IGlobalState {
  snake: ISnakeCoord[] | []
  disallowedDirection: string
  score: number
}

const globalState: IGlobalState = {
  //Position of the entire snake
  snake: [
    { x: 580, y: 300 },
    { x: 560, y: 300 },
    { x: 540, y: 300 },
    { x: 520, y: 300 },
    { x: 500, y: 300 },
  ],
  disallowedDirection: '',
  score: 0,
}

const gameReducer = (state = globalState, action: any) => {
  switch (action.type) {
    case RIGHT:
    case LEFT:
    case UP:
    case DOWN: {
      let newSnake = [...state.snake]
      newSnake = [
        {
          x: state.snake[0] + action.payload[0],
          y: state.snake[0] + action.payload[1],
        },
        ...newSnake,
      ]
      newSnake.pop()

      return {
        ...state,
        snake: newSnake,
      }
    }
    case SET_DIS_DIRECTION:
      return { ...state, disallowedDirection: action.payload }
    case INCREASE_SNAKE:
      const snakeLen = state.snake.length
      return {
        ...state,
        snake: [
          ...state.snake,
          {
            x: state.snake[snakeLen - 1].x - 20,
            y: state.snake[snakeLen - 1].y - 20,
          },
        ],
      }
    case INCREMENT_SCORE:
      return {
        ...state,
        score: state.score + 1,
      }

    default:
      return state
  }
}

export default gameReducer
