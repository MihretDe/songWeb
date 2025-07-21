import { configureStore } from "@reduxjs/toolkit"
import createSagaMiddleware from "redux-saga"
import { all } from "redux-saga/effects"
import songReducer from "./songsSlice"
import { songsSaga } from "./sagas"

// Create saga middleware
const sagaMiddleware = createSagaMiddleware()

// Root saga
function* rootSaga() {
  yield all([songsSaga()])
}

// Configure store
export const store = configureStore({
  reducer: {
    songs: songReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }).concat(sagaMiddleware),
})

// Run saga
sagaMiddleware.run(rootSaga)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
