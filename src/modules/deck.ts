import { ActionType, createAction } from 'typesafe-actions';

export const MAX_DECK_CARD_COUNT = 8;

export interface DeckCardGeneral {
  general: string;
  genMain?: string;
  belongState: string;
  cost: string;
  unitType: string;
  pocket: boolean;
}

export interface DeckCardDummy {
  belongState?: string;
  cost: string;
  unitType?: string;
}

export type DeckCard = DeckCardGeneral | DeckCardDummy;

// 同名武将の制約
// personal: 同名武将不可(通常ルール)
// personal-strategy: 同名武将かつ同計略不可
export type SameCardConstraint = 'personal' | 'personal-strategy';

export interface DeckConstraints {
  limitCost: number;
  sameCard: SameCardConstraint;
}

export interface DeckState {
  deckCards: DeckCard[];
  activeIndex?: number;
  enableSearch: boolean;
  deckConstraints: DeckConstraints;
}

const initialState: DeckState = {
  deckCards: [],
  enableSearch: false,
  deckConstraints: {
    limitCost: 80,
    sameCard: 'personal',
  },
};

export const deckActions = {
  addDeckGeneral: createAction(
    'ADD_DECK_GENERAL',
    action => (card: DeckCardGeneral) => action(card)
  ),
  changeDeckGeneral: createAction(
    'CHANGE_DECK_GENERAL',
    action => (index: number, card: DeckCardGeneral) => action({ index, card })
  ),
  addDeckDummy: createAction(
    'ADD_DECK_DUMMY',
    action => (dummy: {
      cost: string;
      belongState?: string;
      unitType?: string;
    }) => action(dummy)
  ),
  setDeckDummyValue: createAction(
    'SET_DECK_DUMMY_VALUE',
    action => (index: number, deckCard: Partial<DeckCardDummy>) =>
      action({ index, deckCard })
  ),
  setDecks: createAction('SET_DECK_LIST', action => (deckCards: DeckCard[]) =>
    action(deckCards)
  ),
  removeDeck: createAction('REMOVE_DECK', action => (index: number) =>
    action(index)
  ),
  clearDeck: createAction('CLEAR_DECK'),
  setActiveCard: createAction('SET_ACTIVE_CARD', action => (index: number) =>
    action(index)
  ),
  searchByDeck: createAction('SEARCH_BY_DECK', action => (index: number) =>
    action(index)
  ),
  clearActiveCard: createAction('CLEAR_ACTIVE_CARD'),
  selectMainGen: createAction(
    'SELECT_MAIN_GEN',
    action => (index: number, genMain?: string) => action({ index, genMain })
  ),
  setDeckConstraints: createAction(
    'SET_DECK_CONSTRAINTS',
    action => (condition: Partial<DeckConstraints>) => action({ condition })
  ),
};

export default function datalistReducer(
  state: DeckState = initialState,
  actions: ActionType<typeof deckActions>
): DeckState {
  switch (actions.type) {
    case 'ADD_DECK_GENERAL': {
      const card = actions.payload;
      return {
        ...state,
        activeIndex: undefined,
        enableSearch: false,
        deckCards: [...state.deckCards, { ...card }],
      };
    }
    case 'CHANGE_DECK_GENERAL': {
      const { index, card } = actions.payload;
      const deckCards = [...state.deckCards];
      deckCards[index] = { ...card };
      return {
        ...state,
        activeIndex: undefined,
        enableSearch: false,
        deckCards,
      };
    }
    case 'ADD_DECK_DUMMY': {
      const { cost, belongState, unitType } = actions.payload;
      return {
        ...state,
        activeIndex: undefined,
        enableSearch: false,
        deckCards: [
          ...state.deckCards,
          { cost, belongState, unitType, pocket: false },
        ],
      };
    }
    case 'SET_DECK_DUMMY_VALUE': {
      const { index, deckCard } = actions.payload;
      const deckCards = [...state.deckCards];
      const target = deckCards[index];
      if (!target || 'general' in target) {
        return state;
      }
      deckCards[index] = {
        ...target,
        ...deckCard,
      };
      return {
        ...state,
        deckCards,
      };
    }
    case 'SET_DECK_LIST': {
      return {
        ...state,
        deckCards: actions.payload,
      };
    }
    case 'REMOVE_DECK': {
      const index = actions.payload;
      const deckCards = state.deckCards.filter((_v, i) => i !== index);
      return {
        ...state,
        activeIndex: undefined,
        enableSearch: false,
        deckCards,
      };
    }
    case 'CLEAR_DECK': {
      return {
        ...state,
        activeIndex: undefined,
        enableSearch: false,
        deckCards: [],
      };
    }
    case 'SET_ACTIVE_CARD': {
      const activeIndex = actions.payload;
      return {
        ...state,
        activeIndex,
        enableSearch: false,
      };
    }
    case 'SEARCH_BY_DECK': {
      const activeIndex = actions.payload;
      return {
        ...state,
        activeIndex,
        enableSearch: true,
      };
    }
    case 'CLEAR_ACTIVE_CARD': {
      return {
        ...state,
        activeIndex: undefined,
        enableSearch: false,
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
        activeIndex: undefined,
        deckCards,
      };
    }
    case 'SET_DECK_CONSTRAINTS': {
      return {
        ...state,
        deckConstraints: {
          ...state.deckConstraints,
          ...actions.payload.condition,
        },
      };
    }
    default:
      return state;
  }
}
