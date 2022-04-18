import { createStore, applyMiddleware } from 'redux';
import reduxThunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import rootReducer from './reducers';

const middleware = applyMiddleware(
    reduxThunkMiddleware // dispatch synchronous actions asynchronously
);

const composeEnhances = composeWithDevTools({
    trace: true
});

const store = createStore(rootReducer, composeEnhances(middleware));

export default store;
