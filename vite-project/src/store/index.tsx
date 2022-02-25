import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import gameReducer from './reducers'
import watchersSagas from './sagas'

const sagaMiddleware = createSagaMiddleware()

const store = createStore(gameReducer, applyMiddleware(sagaMiddleware))

sagaMiddleware.run(watchersSagas)
export default store
