import { ActionType, createAction } from 'typesafe-actions';
import { DEFAULT_DECK_COST_LIMIT } from '../const';

export interface DeckCardGeneral {
  general: string;
  genMain?: string;
  pocket: boolean;
}

export interface DeckCardDummy {
  belongState?: string;
  cost: string;
  unitType?: string;
}

export type DeckCard = DeckCardGeneral | DeckCardDummy;

interface SearchCondition {
  belongState?: string;
  cost: string;
  unitType?: string;
}

// 同名武将の制約
// personal: 同名武将不可(通常ルール)
// personal-strategy: 同名武将かつ同計略不可
const sameCardConstraints = ['personal', 'personal-strategy'] as const;
export type SameCardConstraint = typeof sameCardConstraints[number];
export const defaultSameCardConstraint: SameCardConstraint = 'personal';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isSameCardConstraint(s: any): s is SameCardConstraint {
  return sameCardConstraints.includes(s);
}

export interface DeckConstraints {
  limitCost: number;
  sameCard: SameCardConstraint;
}

interface DeckState {
  deckCards: DeckCard[];
  activeIndex: number | null;
  searchCondition?: SearchCondition;
  deckConstraints: DeckConstraints;
}

const initialState: DeckState = {
  deckCards: [],
  activeIndex: null,
  searchCondition: undefined,
  deckConstraints: {
    limitCost: DEFAULT_DECK_COST_LIMIT,
    sameCard: defaultSameCardConstraint,
  },
};

export const deckActions = {
  addDeckGeneral: createAction(
    'ADD_DECK_GENERAL',
    (card: DeckCardGeneral) => card
  )(),
  changeDeckGeneral: createAction(
    'CHANGE_DECK_GENERAL',
    (index: number, card: DeckCardGeneral) => ({ index, card })
  )(),
  addDeckDummy: createAction(
    'ADD_DECK_DUMMY',
    (dummy: { cost: string; belongState?: string; unitType?: string }) => dummy
  )(),
  setDeckDummyValue: createAction(
    'SET_DECK_DUMMY_VALUE',
    (index: number, deckCard: Partial<DeckCardDummy>) => ({ index, deckCard })
  )(),
  setDecks: createAction(
    'SET_DECK_LIST',
    (deckCards: DeckCard[]) => deckCards
  )(),
  removeDeck: createAction('REMOVE_DECK', (index: number) => index)(),
  clearDeck: createAction('CLEAR_DECK')(),
  setActiveCard: createAction('SET_ACTIVE_CARD', (index: number) => index)(),
  searchByDeck: createAction(
    'SEARCH_BY_DECK',
    (index: number, condition: SearchCondition) => ({ index, condition })
  )(),
  clearActiveCard: createAction('CLEAR_ACTIVE_CARD')(),
  selectMainGen: createAction(
    'SELECT_MAIN_GEN',
    (index: number, genMain?: string) => ({ index, genMain })
  )(),
  setDeckConstraints: createAction(
    'SET_DECK_CONSTRAINTS',
    (condition: Partial<DeckConstraints>) => ({ condition })
  )(),
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
        activeIndex: null,
        searchCondition: undefined,
        deckCards: [...state.deckCards, { ...card }],
      };
    }
    case 'CHANGE_DECK_GENERAL': {
      const { index, card } = actions.payload;
      const deckCards = [...state.deckCards];
      deckCards[index] = { ...card };
      return {
        ...state,
        activeIndex: null,
        searchCondition: undefined,
        deckCards,
      };
    }
    case 'ADD_DECK_DUMMY': {
      const { cost, belongState, unitType } = actions.payload;
      return {
        ...state,
        activeIndex: null,
        searchCondition: undefined,
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
        activeIndex: null,
        searchCondition: undefined,
        deckCards,
      };
    }
    case 'CLEAR_DECK': {
      return {
        ...state,
        activeIndex: null,
        searchCondition: undefined,
        deckCards: [],
      };
    }
    case 'SET_ACTIVE_CARD': {
      const activeIndex = actions.payload;
      return {
        ...state,
        activeIndex,
        searchCondition: undefined,
      };
    }
    case 'SEARCH_BY_DECK': {
      const { index, condition } = actions.payload;
      return {
        ...state,
        activeIndex: index,
        searchCondition: condition,
      };
    }
    case 'CLEAR_ACTIVE_CARD': {
      return {
        ...state,
        activeIndex: null,
        searchCondition: undefined,
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
        activeIndex: null,
        searchCondition: undefined,
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
