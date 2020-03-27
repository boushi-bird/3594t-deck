import { ActionType, createAction } from 'typesafe-actions';
import {
  DEFAULT_DECK_COST_LIMIT,
  DEFAULT_DECK_ASSIST_CARD_COUNT,
} from '../const';

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

export interface DeckCardAssist {
  assist: string;
}

interface SearchCondition {
  belongState?: string;
  cost: string;
  unitType?: string;
}

// 同名武将の制約
// personal: 同名武将不可・同名遊軍不可(通常ルール)
// personal-strategy-exclude-assist: 同名武将かつ同計略不可・同名遊軍不可
// personal-assist: 同名武将不可・同名遊軍可
// personal-strategy: 同名武将かつ同計略不可・同名遊軍可
const sameCardConstraints = [
  'personal',
  'personal-strategy-exclude-assist',
  'personal-assist',
  'personal-strategy',
] as const;
export type SameCardConstraint = typeof sameCardConstraints[number];
export const defaultSameCardConstraint: SameCardConstraint = 'personal';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isSameCardConstraint(s: any): s is SameCardConstraint {
  return sameCardConstraints.includes(s);
}

export interface DeckConstraints {
  limitCost: number;
  sameCard: SameCardConstraint;
  assistCardLimit: number;
}

interface DeckState {
  deckCards: DeckCard[];
  assistDeckCards: DeckCardAssist[];
  activeIndex: number | null;
  activeAssistIndex: number | null;
  searchCondition?: SearchCondition;
  deckConstraints: DeckConstraints;
}

const initialState: DeckState = {
  deckCards: [],
  assistDeckCards: [],
  activeIndex: null,
  activeAssistIndex: null,
  searchCondition: undefined,
  deckConstraints: {
    limitCost: DEFAULT_DECK_COST_LIMIT,
    sameCard: defaultSameCardConstraint,
    assistCardLimit: DEFAULT_DECK_ASSIST_CARD_COUNT,
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
  addDeckAssist: createAction(
    'ADD_DECK_ASSIST',
    (card: DeckCardAssist) => card
  )(),
  changeDeckAssist: createAction(
    'CHANGE_DECK_ASSIST',
    (index: number, card: DeckCardAssist) => ({ index, card })
  )(),
  setAssists: createAction(
    'SET_ASSIST_LIST',
    (assistDeckCards: DeckCardAssist[]) => assistDeckCards
  )(),
  removeDeckAssist: createAction(
    'REMOVE_DECK_ASSIST',
    (index: number) => index
  )(),
  sliceDeckAssist: createAction('SLICE_DECK_ASSIST')(),
  clearDeck: createAction('CLEAR_DECK')(),
  setActiveCard: createAction('SET_ACTIVE_CARD', (index: number) => index)(),
  setActiveAssistCard: createAction(
    'SET_ACTIVE_ASSIST_CARD',
    (index: number) => index
  )(),
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
        activeAssistIndex: null,
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
        activeAssistIndex: null,
        searchCondition: undefined,
        deckCards,
      };
    }
    case 'ADD_DECK_DUMMY': {
      const { cost, belongState, unitType } = actions.payload;
      return {
        ...state,
        activeIndex: null,
        activeAssistIndex: null,
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
        activeAssistIndex: null,
        searchCondition: undefined,
        deckCards,
      };
    }
    case 'ADD_DECK_ASSIST': {
      const card = actions.payload;
      return {
        ...state,
        activeIndex: null,
        activeAssistIndex: null,
        searchCondition: undefined,
        assistDeckCards: [...state.assistDeckCards, { ...card }],
      };
    }
    case 'CHANGE_DECK_ASSIST': {
      const { index, card } = actions.payload;
      const assistDeckCards = [...state.assistDeckCards];
      assistDeckCards[index] = { ...card };
      return {
        ...state,
        activeIndex: null,
        activeAssistIndex: null,
        searchCondition: undefined,
        assistDeckCards,
      };
    }
    case 'SET_ASSIST_LIST': {
      return {
        ...state,
        assistDeckCards: actions.payload,
      };
    }
    case 'REMOVE_DECK_ASSIST': {
      const index = actions.payload;
      const assistDeckCards = state.assistDeckCards.filter(
        (_v, i) => i !== index
      );
      return {
        ...state,
        activeIndex: null,
        activeAssistIndex: null,
        searchCondition: undefined,
        assistDeckCards,
      };
    }
    case 'SLICE_DECK_ASSIST': {
      const {
        assistDeckCards: current,
        deckConstraints: { assistCardLimit },
      } = state;
      if (current.length <= assistCardLimit) {
        return {
          ...state,
        };
      }
      const assistDeckCards = current.slice(0, assistCardLimit);
      return {
        ...state,
        assistDeckCards,
      };
  }
    case 'CLEAR_DECK': {
      return {
        ...state,
        activeIndex: null,
        activeAssistIndex: null,
        searchCondition: undefined,
        deckCards: [],
        assistDeckCards: [],
      };
    }
    case 'SET_ACTIVE_CARD': {
      const activeIndex = actions.payload;
      return {
        ...state,
        activeIndex,
        activeAssistIndex: null,
        searchCondition: undefined,
      };
    }
    case 'SET_ACTIVE_ASSIST_CARD': {
      const activeAssistIndex = actions.payload;
      return {
        ...state,
        activeIndex: null,
        activeAssistIndex,
        searchCondition: undefined,
      };
    }
    case 'SEARCH_BY_DECK': {
      const { index, condition } = actions.payload;
      return {
        ...state,
        activeIndex: index,
        activeAssistIndex: null,
        searchCondition: condition,
      };
    }
    case 'CLEAR_ACTIVE_CARD': {
      return {
        ...state,
        activeIndex: null,
        activeAssistIndex: null,
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
        activeAssistIndex: null,
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
