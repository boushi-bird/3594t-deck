import { ActionType, createAction } from 'typesafe-actions';

interface DeckCard {
  general?: string;
  genMain?: string;
  state?: string;
  cost?: string;
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
    action => (general: string, genMain?: string) =>
      action({ general, genMain })
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
      const { general, genMain } = actions.payload;
      return {
        ...state,
        deckCards: [...state.deckCards, { general, genMain }],
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
