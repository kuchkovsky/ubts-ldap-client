import { reducer as formReducer } from 'redux-form/immutable';
import { combineReducers } from 'redux-immutable';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import contentReducer from '../reducers/content';

const reducer = combineReducers({
  content: contentReducer,
  form: formReducer,
});

// eslint-disable-next-line
const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducer,
  storeEnhancers(applyMiddleware(thunk)),
);

export default store;
