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
  addDeckDummy: createAction(
    'ADD_DECK_DUMMY',
    action => (dummy: {
      cost: string;
      belongState?: string;
      unitType?: string;
    }) => action(dummy)
  ),
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
    case 'ADD_DECK_DUMMY': {
      const { cost, belongState, unitType } = actions.payload;
      return {
        ...state,
        deckCards: [...state.deckCards, { cost, belongState, unitType }],
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
