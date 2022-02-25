import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import gameReducer from './reducers'
import watchersSagas from './sagas'

const sagaMiddleware = createSagaMiddleware()

const store = createStore(gameReducer, applyMiddleware(sagaMiddleware))
// pass gameReducer to this function so that a reducer is mapped to our store

sagaMiddleware.run(watchersSagas)
export default store
