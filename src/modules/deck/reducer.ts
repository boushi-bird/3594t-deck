import { ActionType, createAction } from 'typesafe-actions';

interface SearchCondition {
  belongState?: string;
  cost: string;
  unitType?: string;
}

// 同名武将の制約
// personal: 同名武将不可(通常ルール)
// personal-strategy: 同名武将かつ同計略不可
export type SameCardConstraint = 'personal' | 'personal-strategy';

export interface DeckConstraints {
  limitCost: number;
  sameCard: SameCardConstraint;
}

interface DeckState {
  activeIndex: number | null;
  searchCondition?: SearchCondition;
  deckConstraints: DeckConstraints;
}

const initialState: DeckState = {
  activeIndex: null,
  searchCondition: undefined,
  deckConstraints: {
    limitCost: 80,
    sameCard: 'personal',
  },
};

export const deckActions = {
  setActiveCard: createAction('SET_ACTIVE_CARD', (index: number) => index)(),
  searchByDeck: createAction(
    'SEARCH_BY_DECK',
    (index: number, condition: SearchCondition) => ({ index, condition })
  )(),
  clearActiveCard: createAction('CLEAR_ACTIVE_CARD')(),
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
