import { createStore, combineReducers } from 'redux';
import { StateType } from 'typesafe-actions';
import datalistReducer from './modules/datalist';
import windowReducer from './modules/window';

const reducers = { datalistReducer, windowReducer };

export type State = StateType<typeof reducers>;

export default createStore(combineReducers<State>(reducers));
