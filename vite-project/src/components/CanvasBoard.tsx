import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  MOVE_RIGHT,
  MOVE_UP,
  MOVE_DOWN,
  RIGHT,
  LEFT,
  UP,
  DOWN,
  makeMove,
  MOVE_LEFT,
  increaseSnake,
  scoreUpdates,
  INCREMENT_SCORE,
  stopGame,
  resetGame,
  RESET_SCORE,
} from '../store/actions'
import { IGlobalState } from '../store/reducers'
import {
  drawObject,
  clearBoard,
  generateRandomPosition,
  IObjectBody,
  hasSnakeCollided,
} from './../utils'

export interface ICanvasBoard {
  height: number
  width: number
}

const CanvasBoard = ({ height, width }: ICanvasBoard) => {
  const snake1 = useSelector((state: IGlobalState) => state.snake)

  const dispatch = useDispatch()

  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)
  const [pos, setPos] = useState<IObjectBody>(
    generateRandomPosition(width - 20, height - 20)
  )
  const [isConsumed, setIsConsumed] = useState<boolean>(false)
  const [gameEnded, setGameEnded] = useState<boolean>(false)

  const disallowedDirection = useSelector(
    (state: IGlobalState) => state.disallowedDirection
  )

  const moveSnake = useCallback(
    (dx = 0, dy = 0, ds: string) => {
      if (dx > 0 && dy === 0 && ds !== RIGHT) {
        dispatch(makeMove(dx, dy, MOVE_RIGHT))
      }

      if (dx < 0 && dy === 0 && ds !== LEFT) {
        dispatch(makeMove(dx, dy, MOVE_LEFT))
      }

      if (dx === 0 && dy < 0 && ds !== UP) {
        dispatch(makeMove(dx, dy, MOVE_UP))
      }

      if (dx === 0 && dy > 0 && ds !== DOWN) {
        dispatch(makeMove(dx, dy, MOVE_DOWN))
      }
    },
    [dispatch]
  )

  const handleKeyEvents = useCallback(
    (event: KeyboardEvent) => {
      if (disallowedDirection) {
        switch (event.key) {
          case 'w':
            moveSnake(0, -20, disallowedDirection)
            break
          case 's':
            moveSnake(0, 20, disallowedDirection)
            break
          case 'a':
            moveSnake(-20, 0, disallowedDirection)
            break
          case 'd':
            event.preventDefault()
            moveSnake(20, 0, disallowedDirection)
            break
        }
      } else {
        if (
          disallowedDirection !== 'LEFT' &&
          disallowedDirection !== 'UP' &&
          disallowedDirection !== 'DOWN' &&
          event.key === 'd'
        )
          moveSnake(20, 0, disallowedDirection) // Move RIGHT at start
      }
    },
    [disallowedDirection, moveSnake]
  )

  const resetBoard = useCallback(() => {
    window.removeEventListener('keypress', handleKeyEvents)
    dispatch(resetGame())
    dispatch(scoreUpdates(RESET_SCORE))
    clearBoard(context)
    drawObject(context, snake1, '#91C483')
    drawObject(
      context,
      [generateRandomPosition(width - 20, height - 20)],
      '#676FA3'
    ) //Draws object randomly
    window.addEventListener('keypress', handleKeyEvents)
  }, [context, dispatch, handleKeyEvents, height, snake1, width])

  useEffect(() => {
    //Generate new object
    if (isConsumed) {
      const posi = generateRandomPosition(width - 20, height - 20)
      setPos(posi)
      setIsConsumed(false)

      //Increase snake size when object is consumed successfully
      dispatch(increaseSnake())

      //Increment the score
      dispatch(scoreUpdates(INCREMENT_SCORE))
    }
  }, [isConsumed, pos, height, width, dispatch])

  useEffect(() => {
    //Draw on canvas each time
    setContext(canvasRef.current && canvasRef.current.getContext('2d')) // store in state variable
    clearBoard(context)
    drawObject(context, snake1, '#91C483') //Draws snake at required position
    drawObject(context, [pos], '#676FA3') //Draws fruit randomly

    //When the object is consumed
    if (snake1[0].x === pos?.x && snake1[0].y === pos?.y) {
      setIsConsumed(true)
    }

    if (
      //checks if the snake has collided with itself
      hasSnakeCollided(snake1, snake1[0]) ||
      //checks if the snake head is out of the boundaries of the box
      snake1[0].x >= width ||
      snake1[0].x <= 0 ||
      snake1[0].y <= 0 ||
      snake1[0].y >= height
    ) {
      setGameEnded(true)
      dispatch(stopGame())
      window.removeEventListener('keypress', handleKeyEvents)
    } else setGameEnded(false)
  }, [context, pos, snake1, height, width, dispatch, handleKeyEvents])

  //! Snake movements
  useEffect(() => {
    window.addEventListener('keypress', handleKeyEvents)

    //cleanup
    return () => {
      window.removeEventListener('keypress', handleKeyEvents)
    }
  }, [disallowedDirection, handleKeyEvents])

  return (
    <canvas
      ref={canvasRef}
      style={{ border: '3px solid black' }}
      height={height}
      width={width}
    />
  )
}

export default CanvasBoard
