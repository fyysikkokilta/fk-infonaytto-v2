import { put, delay, all, select } from "redux-saga/effects";
import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import produce from "immer";
import { createAction } from "redux-actions";
import createSagaMiddleware from "redux-saga";
import logger from 'redux-logger';
import { selectPage } from "./Page";

const PAGE_CHANGE = "PAGE/CHANGE";
const PAGE_ENQUEUE = "PAGE/ENQUEUE";

const changePage = createAction(PAGE_CHANGE);
const enqueuePage = createAction(PAGE_ENQUEUE);

const pageReducer = (state = { page: selectPage() }, action) => {
  return produce(state, draft => {
    switch (action.type) {
      case PAGE_CHANGE:
        draft.component = action.payload;
        break;
      default:
        break;
    }
  });
};

function* pageSaga() {
  while (true) {
    const page = selectPage();
    yield put(changePage(page));
    yield delay(page.timeout || 5000);
  }
}

function* rootSaga() {
  yield all([pageSaga()]);
}

export default function configureStore() {
  const sagaMiddleware = createSagaMiddleware();

  const middlewares = [sagaMiddleware];

  middlewares.push(logger);

  const rootReducer = combineReducers({
    page: pageReducer
  });

  const devToolsCompose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

  const composeEnhancers = devToolsCompose
    ? devToolsCompose({
        trace: true,
        traceLimit: 10 // This is default limit imposed by Chrome.
        // Increase if you need to see more of stacktrace.
      })
    : compose;

  const enhancer = composeEnhancers(applyMiddleware(...middlewares));

  const store = createStore(rootReducer, undefined, enhancer);

  sagaMiddleware.run(rootSaga);

  return store;
}
