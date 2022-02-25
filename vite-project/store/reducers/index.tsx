const GlobalState = {
  data: '',
}

const gameReduceer = (state = GlobalState, action) => {
  switch (action.type) {
    case 'MOVE_RIGHT':
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
