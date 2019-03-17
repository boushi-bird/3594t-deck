import { ActionType, createAction } from 'typesafe-actions';

export interface DeckCard {
  general?: string;
  genMain?: string;
  belongState?: string;
  cost: string;
  unitType?: string;
}

export interface DeckState {
  deckCards: DeckCard[];
  activeIndex?: number;
}

const initialState: DeckState = {
  deckCards: [],
};

export const deckActions = {
  addDeckGeneral: createAction(
    'ADD_DECK_GENERAL',
    action => (card: { general: string; cost: string; genMain?: string }) =>
      action(card)
  ),
  changeDeckGeneral: createAction(
    'CHANGE_DECK_GENERAL',
    action => (
      index: number,
      card: { general: string; cost: string; genMain?: string }
    ) => action({ index, card })
  ),
  addDeckDummy: createAction(
    'ADD_DECK_DUMMY',
    action => (dummy: {
      cost: string;
      belongState?: string;
      unitType?: string;
    }) => action(dummy)
  ),
  setActiveCard: createAction('SET_ACTIVE_CARD', action => (index: number) =>
    action(index)
  ),
  clearActiveCard: createAction('CLEAR_ACTIVE_CARD'),
  selectMainGen: createAction(
    'SELECT_MAIN_GEN',
    action => (index: number, genMain?: string) => action({ index, genMain })
  ),
};

export default function datalistReducer(
  state: DeckState = initialState,
  actions: ActionType<typeof deckActions>
): DeckState {
  switch (actions.type) {
    case 'ADD_DECK_GENERAL': {
      const { general, cost, genMain } = actions.payload;
      return {
        ...state,
        deckCards: [...state.deckCards, { general, cost, genMain }],
      };
    }
    case 'CHANGE_DECK_GENERAL': {
      const { index, card } = actions.payload;
      const { general, cost, genMain } = card;
      const deckCards = [...state.deckCards];
      deckCards[index] = { general, cost, genMain };
      return {
        ...state,
        deckCards,
      };
    }
    case 'ADD_DECK_DUMMY': {
      const { cost, belongState, unitType } = actions.payload;
      return {
        ...state,
        deckCards: [...state.deckCards, { cost, belongState, unitType }],
      };
    }
    case 'SET_ACTIVE_CARD': {
      const activeIndex = actions.payload;
      return {
        ...state,
        activeIndex,
      };
    }
    case 'CLEAR_ACTIVE_CARD': {
      return {
        ...state,
        activeIndex: undefined,
      };
    }
    case 'SELECT_MAIN_GEN': {
      const { index, genMain } = actions.payload;
      const deckCards = [...state.deckCards];
      const deckCard = deckCards[index];
      if (deckCard == null) {
        return state;
      }
      deckCards[index] = {
        ...deckCard,
        genMain,
      };
      return {
        ...state,
        deckCards,
      };
    }
    default:
      return state;
  }
}
