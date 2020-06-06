import { configureStore } from '@reduxjs/toolkit';
import { datalistModule } from './modules/datalist';
import { deckModule } from './modules/deck';
import { dialogModule } from './modules/dialog';
import { windowModule } from './modules/window';

const store = configureStore({
  reducer: {
    datalist: datalistModule.reducer,
    deck: deckModule.reducer,
    dialog: dialogModule.reducer,
    window: windowModule.reducer,
  },
});

export type State = ReturnType<typeof store.getState>;

export default store;
