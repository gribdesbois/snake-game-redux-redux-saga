import { DOWN, UP, LEFT, RIGHT } from '../actions'

const GlobalState = {
  data: '',
}
interface ISnakeCoord {
  x: number
  y: number
}
export interface IGlobalState {
  snake: ISnakeCoord[] | []
  disallowedDirection: string
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
}

const gameReducer = (state = globalState, action: any) => {
  switch (action.type) {
    case RIGHT:
    case LEFT:
    case UP:
    case DOWN:
      {
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
      /**
       * Perform a certain set of operations
       */
      return {
        ...state,
        data: action.payload,
      }
    default:
      return state
  }
}

export default gameReducer
