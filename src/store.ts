import { createStore, combineReducers } from 'redux';
import { StateType } from 'typesafe-actions';
import datalistReducer from './modules/datalist';
import deckReducer from './modules/deck/reducer';
import dialogReducer from './modules/dialog';
import windowReducer from './modules/window';

const reducers = { datalistReducer, deckReducer, dialogReducer, windowReducer };

export type State = StateType<typeof reducers>;

export default createStore(combineReducers<State>(reducers));
