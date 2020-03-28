import { createStore, combineReducers } from 'redux';
import type { StateType } from 'typesafe-actions';
import type datalistReducer from './modules/datalist';
import type deckReducer from './modules/deck';
import type dialogReducer from './modules/dialog';
import type windowReducer from './modules/window';

const reducers = { datalistReducer, deckReducer, dialogReducer, windowReducer };

export type State = StateType<typeof reducers>;

export default createStore(combineReducers<State>(reducers));
