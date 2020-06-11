import type { ParamsOptions } from 'redux-query-sync';
import reduxQuerySync from 'redux-query-sync';
import type { General, AssistGeneral, FilterContents } from '3594t-deck';
import {
  DEFAULT_DECK_COST_LIMIT,
  MIN_DECK_COST_LIMIT,
  MAX_DECK_COST_LIMIT,
  STEP_DECK_COST_LIMIT,
  DEFAULT_DECK_ASSIST_CARD_COUNT,
  MAX_DECK_ASSIST_CARD_COUNT,
} from '../const';
import type { State } from '../store';
import store from '../store';
import type {
  DeckCard,
  KeyLessDeckCard,
  KeyLessDeckCardGeneral,
  KeyLessDeckCardDummy,
  DeckCardAssist,
  SameCardConstraint,
} from './deck';
import {
  isSameCardConstraint,
  defaultSameCardConstraint,
  deckActions,
} from './deck';

interface DataContents {
  generals: General[];
  filterContents: FilterContents;
}

const toQueryDeckCard = ({ generals, filterContents }: DataContents) => {
  return (deckCard: DeckCard): string => {
    if ('general' in deckCard) {
      const general = generals.find((g) => g.id === deckCard.general);
      if (!general) {
        return '';
      }
      const genMain = filterContents.genMains.find(
        (r) => r.id === deckCard.genMain
      );
      const code = deckCard.pocket ? general.pocketCode : general.code;
      const genMainCode = genMain ? genMain.code : '';
      // 武将 (code)_(genMainCode)
      return [code, genMainCode].join('_');
    }
    const belongState = filterContents.belongStates.find(
      (r) => r.id === deckCard.belongState
    );
    const belongStateNameShort = belongState ? belongState.nameShort : '';
    const unitType = filterContents.unitTypes.find(
      (r) => r.id === deckCard.unitType
    );
    const unitTypeName = unitType ? unitType.name[0] : '';
    // ダミー __(cost)_(belongStateNameShort)_(unitTypeName[先頭1文字])
    return ['', '', deckCard.cost, belongStateNameShort, unitTypeName].join(
      '_'
    );
  };
};

const parseDeckCardGeneral = (
  {
    code,
    genMainCode,
  }: {
    code?: string;
    genMainCode?: string;
  },
  { generals, filterContents }: DataContents
): KeyLessDeckCardGeneral | null => {
  if (!code) {
    return null;
  }
  const general = generals.find(
    (g) => g.code === code || g.pocketCode === code
  );
  if (!general) {
    return null;
  }
  const pocket = general.code !== code;
  const genMain = filterContents.genMains.find((g) => g.code === genMainCode);
  let genMainid: string | undefined = undefined;
  if (genMain && general.genMains.includes(genMain)) {
    genMainid = genMain.id;
  }
  return {
    general: general.id,
    genMain: genMainid,
    pocket,
  };
};

const parseDeckCardDummy = (
  {
    cost,
    belongStateNameShort,
    unitTypeName,
  }: {
    cost?: string;
    belongStateNameShort?: string;
    unitTypeName?: string;
  },
  content: FilterContents
): KeyLessDeckCardDummy => {
  const belongState = content.belongStates.find(
    (r) => r.nameShort === belongStateNameShort
  );
  const unitType = content.unitTypes.find((r) => r.name[0] === unitTypeName);
  return {
    cost: cost && content.costs.findIndex((r) => r.code === cost) ? cost : '10',
    belongState: belongState ? belongState.id : undefined,
    unitType: unitType ? unitType.id : undefined,
  };
};

const parseDeckCard = ({ generals, filterContents }: DataContents) => {
  return (v: string): KeyLessDeckCard => {
    const [
      code,
      genMainCode,
      cost,
      belongStateNameShort,
      unitTypeName,
    ] = v.split('_');
    const g = parseDeckCardGeneral(
      { code, genMainCode },
      { generals, filterContents }
    );
    if (g) {
      return g;
    }
    return parseDeckCardDummy(
      {
        cost,
        belongStateNameShort,
        unitTypeName,
      },
      filterContents
    );
  };
};

// defaultValue と=== 比較で一致する場合にparameterがなくなるので空を同一インスタンスに
const emptyDecks: KeyLessDeckCard[] = [];
const emptyAssistDecks: DeckCardAssist[] = [];

const deckParam: ParamsOptions<State, KeyLessDeckCard[]> = {
  action: deckActions.setDecks,
  selector: (state) => {
    const deckCards = state.deck.deckCards;
    if (deckCards.length === 0) {
      return emptyDecks;
    }
    return deckCards;
  },
  defaultValue: emptyDecks,
  valueToString: (deckCards) => {
    const { datalist } = store.getState();
    const toQuery = toQueryDeckCard({
      generals: datalist.generals,
      filterContents: datalist.filterContents,
    });
    return deckCards
      .map(toQuery)
      .filter((r) => r)
      .join('|');
  },
  stringToValue: (s) => {
    if (!s) {
      return emptyDecks;
    }
    const { datalist } = store.getState();
    const parse = parseDeckCard({
      generals: datalist.generals,
      filterContents: datalist.filterContents,
    });
    return s.split('|').map(parse);
  },
};

interface DataAssistContents {
  assistGenerals: AssistGeneral[];
}

const toQueryDeckCardAssist = ({ assistGenerals }: DataAssistContents) => {
  return (deckCardAssist: DeckCardAssist): string => {
    const assistGeneral = assistGenerals.find(
      (a) => a.id === deckCardAssist.assist
    );
    if (!assistGeneral) {
      return '';
    }
    return assistGeneral.code;
  };
};

const parseDeckCardAssist = ({ assistGenerals }: DataAssistContents) => {
  return (code: string): DeckCardAssist | null => {
    const assistGeneral = assistGenerals.find((a) => a.code === code);
    const assist = assistGeneral?.id ?? null;
    if (!assist) {
      return null;
    }
    return { assist };
  };
};

const assistParam: ParamsOptions<State, DeckCardAssist[]> = {
  action: deckActions.setAssists,
  selector: (state) => {
    const assistDeckCards = state.deck.assistDeckCards;
    if (assistDeckCards.length === 0) {
      return emptyAssistDecks;
    }
    return assistDeckCards;
  },
  defaultValue: emptyAssistDecks,
  valueToString: (assistDeckCards) => {
    const { datalist } = store.getState();
    const toQuery = toQueryDeckCardAssist({
      assistGenerals: datalist.assistGenerals,
    });
    return assistDeckCards
      .map(toQuery)
      .filter((r) => r)
      .join('|');
  },
  stringToValue: (s) => {
    if (!s) {
      return emptyAssistDecks;
    }
    const { datalist } = store.getState();
    const parse = parseDeckCardAssist({
      assistGenerals: datalist.assistGenerals,
    });
    return s
      .split('|')
      .map(parse)
      .filter((d): d is DeckCardAssist => !!d);
  },
};

const costParam: ParamsOptions<State, number> = {
  action: (limitCost) => deckActions.setDeckConstraints({ limitCost }),
  selector: (state) => state.deck.deckConstraints.limitCost,
  defaultValue: DEFAULT_DECK_COST_LIMIT,
  stringToValue: (s) => {
    try {
      const limitCost = parseInt(s);
      if (
        limitCost >= MIN_DECK_COST_LIMIT &&
        limitCost <= MAX_DECK_COST_LIMIT &&
        limitCost % STEP_DECK_COST_LIMIT === 0
      ) {
        return limitCost;
      }
    } catch (e) {}
    return DEFAULT_DECK_COST_LIMIT;
  },
};

const sameCardParam: ParamsOptions<State, SameCardConstraint> = {
  action: (sameCard) => deckActions.setDeckConstraints({ sameCard }),
  selector: (state) => state.deck.deckConstraints.sameCard,
  defaultValue: defaultSameCardConstraint,
  stringToValue: (s) => {
    if (isSameCardConstraint(s)) {
      return s;
    }
    return defaultSameCardConstraint;
  },
};

const assistLimitParam: ParamsOptions<State, number> = {
  action: (assistCardLimit) =>
    deckActions.setDeckConstraints({ assistCardLimit }),
  selector: (state) => state.deck.deckConstraints.assistCardLimit,
  defaultValue: DEFAULT_DECK_ASSIST_CARD_COUNT,
  stringToValue: (s) => {
    try {
      const assistCardLimit = parseInt(s);
      if (
        assistCardLimit >= 0 &&
        assistCardLimit <= MAX_DECK_ASSIST_CARD_COUNT &&
        assistCardLimit % 1 === 0
      ) {
        return assistCardLimit;
      }
    } catch (e) {}
    return DEFAULT_DECK_ASSIST_CARD_COUNT;
  },
};

let init = false;

export default function (): void {
  if (init) {
    return;
  }
  reduxQuerySync<State>({
    store,
    params: {
      deck: deckParam,
      assist: assistParam,
      cost: costParam,
      ['same_card']: sameCardParam,
      ['assist_limit']: assistLimitParam,
    },
    initialTruth: 'location',
  });
  init = true;
}
