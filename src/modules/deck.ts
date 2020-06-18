import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import {
  DEFAULT_DECK_COST_LIMIT,
  DEFAULT_DECK_ASSIST_CARD_COUNT,
  DEFAULT_GEN_MAIN_AWAKING_LIMIT,
  DEFAULT_GEN_MAIN_SP_AWAKING_COUNT,
} from '../const';

// デッキのユニークIDとして使う揮発的な数値
let currentDeckKey = 0;

export interface DeckCardGeneral {
  key: number;
  general: string;
  genMain?: string;
  genMainAwaking: boolean;
  pocket: boolean;
}

export interface DeckCardDummy {
  key: number;
  belongState?: string;
  cost: string;
  unitType?: string;
}

export type DeckCard = DeckCardGeneral | DeckCardDummy;

export type KeyLessDeckCardGeneral = Omit<DeckCardGeneral, 'key'>;
export type KeyLessDeckCardDummy = Omit<DeckCardDummy, 'key'>;

export type KeyLessDeckCard = KeyLessDeckCardGeneral | KeyLessDeckCardDummy;

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
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function isSameCardConstraint(s: any): s is SameCardConstraint {
  return sameCardConstraints.includes(s);
}

type MoveDirection = 'left' | 'right';

export interface DeckConstraints {
  limitCost: number;
  sameCard: SameCardConstraint;
  assistCardLimit: number;
  genMainAwakingLimit: number;
  genMainSpAwakingCount: number;
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
    genMainAwakingLimit: DEFAULT_GEN_MAIN_AWAKING_LIMIT,
    genMainSpAwakingCount: DEFAULT_GEN_MAIN_SP_AWAKING_COUNT,
  },
};

export const deckModule = createSlice({
  name: 'deck',
  initialState,
  reducers: {
    addDeckGeneral(
      state: DeckState,
      action: PayloadAction<KeyLessDeckCardGeneral>
    ): DeckState {
      const card = {
        ...action.payload,
        key: currentDeckKey++,
      };
      return {
        ...state,
        activeIndex: null,
        activeAssistIndex: null,
        searchCondition: undefined,
        deckCards: [...state.deckCards, { ...card }],
      };
    },
    changeDeckGeneral(
      state: DeckState,
      action: PayloadAction<{
        index: number;
        card: KeyLessDeckCardGeneral;
      }>
    ): DeckState {
      const { index, card } = action.payload;
      const deckCards = [...state.deckCards];
      deckCards[index] = { ...card, key: deckCards[index].key };
      return {
        ...state,
        activeIndex: null,
        activeAssistIndex: null,
        searchCondition: undefined,
        deckCards,
      };
    },
    addDeckDummy(
      state: DeckState,
      action: PayloadAction<{
        cost: string;
        belongState?: string;
        unitType?: string;
      }>
    ): DeckState {
      const { cost, belongState, unitType } = action.payload;
      return {
        ...state,
        activeIndex: null,
        activeAssistIndex: null,
        searchCondition: undefined,
        deckCards: [
          ...state.deckCards,
          { key: currentDeckKey++, cost, belongState, unitType, pocket: false },
        ],
      };
    },
    setDeckDummyValue(
      state: DeckState,
      action: PayloadAction<{
        index: number;
        deckCard: Partial<DeckCardDummy>;
      }>
    ): DeckState {
      const { index, deckCard } = action.payload;
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
    },
    setDecks(
      state: DeckState,
      action: PayloadAction<KeyLessDeckCard[]>
    ): DeckState {
      const deckCards = action.payload.map((deckCard) => ({
        ...deckCard,
        key: currentDeckKey++,
      }));
      return {
        ...state,
        deckCards,
      };
    },
    removeDeck(state: DeckState, action: PayloadAction<number>): DeckState {
      const index = action.payload;
      const deckCards = state.deckCards.filter((_v, i) => i !== index);
      return {
        ...state,
        activeIndex: null,
        activeAssistIndex: null,
        searchCondition: undefined,
        deckCards,
      };
    },
    addDeckAssist(
      state: DeckState,
      action: PayloadAction<DeckCardAssist>
    ): DeckState {
      const card = action.payload;
      return {
        ...state,
        activeIndex: null,
        activeAssistIndex: null,
        searchCondition: undefined,
        assistDeckCards: [...state.assistDeckCards, { ...card }],
      };
    },
    changeDeckAssist(
      state: DeckState,
      action: PayloadAction<{
        index: number;
        card: DeckCardAssist;
      }>
    ): DeckState {
      const { index, card } = action.payload;
      const assistDeckCards = [...state.assistDeckCards];
      assistDeckCards[index] = { ...card };
      return {
        ...state,
        activeIndex: null,
        activeAssistIndex: null,
        searchCondition: undefined,
        assistDeckCards,
      };
    },
    setAssists(
      state: DeckState,
      action: PayloadAction<DeckCardAssist[]>
    ): DeckState {
      return {
        ...state,
        assistDeckCards: action.payload,
      };
    },
    removeDeckAssist(
      state: DeckState,
      action: PayloadAction<number>
    ): DeckState {
      const index = action.payload;
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
    },
    sliceDeckAssist(state: DeckState): DeckState {
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
    },
    clearDeck(state: DeckState): DeckState {
      return {
        ...state,
        activeIndex: null,
        activeAssistIndex: null,
        searchCondition: undefined,
        deckCards: [],
        assistDeckCards: [],
      };
    },
    setActiveCard(state: DeckState, action: PayloadAction<number>): DeckState {
      return {
        ...state,
        activeIndex: action.payload,
        activeAssistIndex: null,
        searchCondition: undefined,
      };
    },
    setActiveAssistCard(
      state: DeckState,
      action: PayloadAction<number>
    ): DeckState {
      return {
        ...state,
        activeIndex: null,
        activeAssistIndex: action.payload,
        searchCondition: undefined,
      };
    },
    searchByDeck(
      state: DeckState,
      action: PayloadAction<{
        index: number;
        condition: SearchCondition;
      }>
    ): DeckState {
      const { index, condition } = action.payload;
      return {
        ...state,
        activeIndex: index,
        activeAssistIndex: null,
        searchCondition: condition,
      };
    },
    clearActiveCard(state: DeckState): DeckState {
      return {
        ...state,
        activeIndex: null,
        activeAssistIndex: null,
        searchCondition: undefined,
      };
    },
    selectMainGen(
      state: DeckState,
      action: PayloadAction<{
        index: number;
        genMain?: string;
      }>
    ): DeckState {
      const { index, genMain } = action.payload;
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
    },
    awakeMainGen(
      state: DeckState,
      action: PayloadAction<{
        index: number;
        awake: boolean;
      }>
    ): DeckState {
      const { index, awake } = action.payload;
      const deckCards = [...state.deckCards];
      const deckCard = deckCards[index];
      if (deckCard == null) {
        return state;
      }
      deckCards[index] = {
        ...deckCard,
        genMainAwaking: awake,
      };
      return {
        ...state,
        activeIndex: null,
        activeAssistIndex: null,
        searchCondition: undefined,
        deckCards,
      };
    },
    setDeckConstraints(
      state: DeckState,
      action: PayloadAction<Partial<DeckConstraints>>
    ): DeckState {
      return {
        ...state,
        deckConstraints: {
          ...state.deckConstraints,
          ...action.payload,
        },
      };
    },
    moveDeckIndex(
      state: DeckState,
      {
        payload: { index, direction },
      }: PayloadAction<{ index: number; direction: MoveDirection }>
    ): DeckState {
      const leftIndex = direction === 'left' ? index - 1 : index;
      const rightIndex = direction === 'right' ? index + 1 : index;
      if (
        state.deckCards.length < 2 ||
        leftIndex < 0 ||
        rightIndex < 0 ||
        leftIndex >= state.deckCards.length ||
        rightIndex >= state.deckCards.length
      ) {
        return state;
      }
      const deckCards = [...state.deckCards];
      deckCards.splice(
        leftIndex,
        2,
        deckCards[rightIndex],
        deckCards[leftIndex]
      );
      return {
        ...state,
        deckCards,
        activeIndex: direction === 'left' ? leftIndex : rightIndex,
      };
    },
  },
});

export const deckActions = {
  ...deckModule.actions,
  /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
  changeDeckGeneral: (index: number, card: KeyLessDeckCardGeneral) =>
    deckModule.actions.changeDeckGeneral({ index, card }),
  setDeckDummyValue: (index: number, deckCard: Partial<KeyLessDeckCardDummy>) =>
    deckModule.actions.setDeckDummyValue({ index, deckCard }),
  changeDeckAssist: (index: number, card: DeckCardAssist) =>
    deckModule.actions.changeDeckAssist({ index, card }),
  searchByDeck: (index: number, condition: SearchCondition) =>
    deckModule.actions.searchByDeck({ index, condition }),
  selectMainGen: (index: number, genMain?: string) =>
    deckModule.actions.selectMainGen({ index, genMain }),
  awakeMainGen: (index: number, awake: boolean) =>
    deckModule.actions.awakeMainGen({ index, awake }),
  /* eslint-enable @typescript-eslint/explicit-module-boundary-types */
};
