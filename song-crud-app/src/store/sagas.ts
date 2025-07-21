import { call, put, takeEvery } from "redux-saga/effects";
import { fetchSongs, fetchSongsSuccess, fetchSongsFailure } from "./songsSlice";

function* fetchSongsWorker(): Generator<any, void, any> {
  try {
    const response: Response = yield call(() =>
      fetch(`${process.env.API_BASE_URL}/songs`)
    );
    const data = yield response.json();
    yield put(fetchSongsSuccess(data));
  } catch (error: any) {
    yield put(fetchSongsFailure(error.message));
  }
}

export default function* rootSaga() {
  yield takeEvery(fetchSongs.type, fetchSongsWorker);
}
