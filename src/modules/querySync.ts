import reduxQuerySync, { ParamsOptions } from 'redux-query-sync';
import { General, FilterContents } from '3594t-deck';
import {
  DEFAULT_DECK_COST_LIMIT,
  MIN_DECK_COST_LIMIT,
  MAX_DECK_COST_LIMIT,
  STEP_DECK_COST_LIMIT,
} from '../const';
import store, { State } from '../store';
import {
  DeckCard,
  DeckCardGeneral,
  DeckCardDummy,
  SameCardConstraint,
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
      const general = generals.find(g => g.id === deckCard.general);
      if (!general) {
        return '';
      }
      const genMain = filterContents.genMains.find(
        r => r.id === deckCard.genMain
      );
      const code = deckCard.pocket ? general.pocketCode : general.code;
      const genMainCode = genMain ? genMain.code : '';
      // 武将 (code)_(genMainCode)
      return [code, genMainCode].join('_');
    }
    const belongState = filterContents.belongStates.find(
      r => r.id === deckCard.belongState
    );
    const belongStateNameShort = belongState ? belongState.nameShort : '';
    const unitType = filterContents.unitTypes.find(
      r => r.id === deckCard.unitType
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
): DeckCardGeneral | null => {
  if (!code) {
    return null;
  }
  const general = generals.find(g => g.code === code || g.pocketCode === code);
  if (!general) {
    return null;
  }
  const pocket = general.code !== code;
  const genMain = filterContents.genMains.find(g => g.code === genMainCode);
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
): DeckCardDummy => {
  const belongState = content.belongStates.find(
    r => r.nameShort === belongStateNameShort
  );
  const unitType = content.unitTypes.find(r => r.name[0] === unitTypeName);
  return {
    cost: cost && content.costs.findIndex(r => r.code === cost) ? cost : '10',
    belongState: belongState ? belongState.id : undefined,
    unitType: unitType ? unitType.id : undefined,
  };
};

const parseDeckCard = ({ generals, filterContents }: DataContents) => {
  return (v: string): DeckCard => {
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
const emptyDecks: DeckCard[] = [];

const deckParam: ParamsOptions<State, DeckCard[]> = {
  action: deckActions.setDecks,
  selector: state => {
    const deckCards = state.deckReducer.deckCards;
    if (deckCards.length === 0) {
      return emptyDecks;
    }
    return deckCards;
  },
  defaultValue: emptyDecks,
  valueToString: deckCards => {
    const dataState = store.getState().datalistReducer;
    const toQuery = toQueryDeckCard({
      generals: dataState.generals,
      filterContents: dataState.filterContents,
    });
    return deckCards
      .map(toQuery)
      .filter(r => r)
      .join('|');
  },
  stringToValue: s => {
    if (!s) {
      return emptyDecks;
    }
    const dataState = store.getState().datalistReducer;
    const parse = parseDeckCard({
      generals: dataState.generals,
      filterContents: dataState.filterContents,
    });
    return s.split('|').map(parse);
  },
};

const costParam: ParamsOptions<State, number> = {
  action: limitCost => deckActions.setDeckConstraints({ limitCost }),
  selector: state => state.deckReducer.deckConstraints.limitCost,
  defaultValue: DEFAULT_DECK_COST_LIMIT,
  stringToValue: s => {
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
  action: sameCard => deckActions.setDeckConstraints({ sameCard }),
  selector: state => state.deckReducer.deckConstraints.sameCard,
  defaultValue: defaultSameCardConstraint,
  stringToValue: s => {
    if (isSameCardConstraint(s)) {
      return s;
    }
    return defaultSameCardConstraint;
  },
};

let init = false;

export default function() {
  if (init) {
    return;
  }
  reduxQuerySync<State>({
    store,
    params: {
      deck: deckParam,
      cost: costParam,
      ['same_card']: sameCardParam,
    },
    initialTruth: 'location',
  });
  init = true;
}
