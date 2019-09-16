import { RouteComponentProps } from 'react-router-dom';
import { General } from '../../interfaces';
import { FilterContents } from '../datalist';
import store from '../../store';

const queryName = 'deck';

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

abstract class DeckQueryActionsBase {
  protected values: DeckCard[];
  constructor(private props: RouteComponentProps, private generals: General[]) {
    this.values = this.parseDeckCards();
  }

  private get content(): FilterContents {
    return store.getState().datalistReducer.filterContents;
  }

  public get deckCards(): DeckCard[] {
    return this.values;
  }

  protected push = (deckCards: DeckCard[]): void => {
    const params = new URLSearchParams(window.location.search);
    const query = this.toQuery(deckCards);
    if (query) {
      params.set(queryName, this.toQuery(deckCards));
    } else {
      params.delete(queryName);
    }
    const search = `?${params}`;
    if (search !== '?') {
      this.props.history.push(search);
    } else {
      this.props.history.push('');
    }
  };

  private toQuery = (deckCards: DeckCard[]): string => {
    return deckCards
      .map(this.toQueryDeckCard)
      .filter(r => r)
      .join('|');
  };

  private toQueryDeckCard = (deckCard: DeckCard): string => {
    const content = this.content;
    if ('general' in deckCard) {
      const general = this.generals.find(g => g.id === deckCard.general);
      if (!general) {
        return '';
      }
      const genMain = content.genMains.find(r => r.id === deckCard.genMain);
      const code = deckCard.pocket ? general.pocketCode : general.code;
      const genMainCode = genMain ? genMain.code : '';
      // 武将 (code)_(genMainCode)
      return [code, genMainCode].join('_');
    }
    const belongState = content.belongStates.find(
      r => r.id === deckCard.belongState
    );
    const belongStateNameShort = belongState ? belongState.nameShort : '';
    const unitType = content.unitTypes.find(r => r.id === deckCard.unitType);
    const unitTypeName = unitType ? unitType.name[0] : '';
    // ダミー __(cost)_(belongStateNameShort)_(unitTypeName[先頭1文字])
    return ['', '', deckCard.cost, belongStateNameShort, unitTypeName].join(
      '_'
    );
  };

  private parseDeckCards = (): DeckCard[] => {
    const params = new URLSearchParams(this.props.location.search);
    const query = params.get(queryName);
    if (!query) {
      return [];
    }
    return query.split('|').map(this.parseDeckCard);
  };

  private parseDeckCard = (v: string): DeckCard => {
    const [
      code,
      genMainCode,
      cost,
      belongStateNameShort,
      unitTypeName,
    ] = v.split('_');
    const g = this.parseDeckCardGeneral({ code, genMainCode });
    if (g) {
      return g;
    }
    return this.parseDeckCardDummy({
      cost,
      belongStateNameShort,
      unitTypeName,
    });
  };

  private parseDeckCardGeneral = ({
    code,
    genMainCode,
  }: {
    code?: string;
    genMainCode?: string;
  }): DeckCardGeneral | null => {
    if (!code) {
      return null;
    }
    const general = this.generals.find(
      g => g.code === code || g.pocketCode === code
    );
    if (!general) {
      return null;
    }
    const pocket = general.code !== code;
    const genMain = this.content.genMains.find(g => g.code === genMainCode);
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

  private parseDeckCardDummy = ({
    cost,
    belongStateNameShort,
    unitTypeName,
  }: {
    cost?: string;
    belongStateNameShort?: string;
    unitTypeName?: string;
  }): DeckCardDummy => {
    const belongState = this.content.belongStates.find(
      r => r.nameShort === belongStateNameShort
    );
    const unitType = this.content.unitTypes.find(
      r => r.name[0] === unitTypeName
    );
    return {
      cost:
        cost && this.content.costs.findIndex(r => r.code === cost)
          ? cost
          : '10',
      belongState: belongState ? belongState.id : undefined,
      unitType: unitType ? unitType.id : undefined,
    };
  };
}

export class DeckQueryActions extends DeckQueryActionsBase {
  addDeckGeneral = (card: DeckCardGeneral) => {
    const deckCards = [...this.deckCards, { ...card }];
    this.push(deckCards);
  };

  changeDeckGeneral = (index: number, card: DeckCardGeneral) => {
    const deckCards = [...this.deckCards];
    deckCards[index] = { ...card };
    this.push(deckCards);
  };

  addDeckDummy = (card: DeckCardDummy) => {
    const deckCards = [...this.deckCards, { ...card }];
    this.push(deckCards);
  };

  setDeckDummyValue = (index: number, card: Partial<DeckCardDummy>) => {
    const deckCards = [...this.deckCards];
    const deckCard = deckCards[index];
    if (!deckCard || 'general' in deckCard) {
      return;
    }
    deckCards[index] = {
      ...deckCard,
      ...card,
    };
    this.push(deckCards);
  };

  removeDeck = (index: number) => {
    const deckCards = this.deckCards.filter((_v, i) => i !== index);
    this.push(deckCards);
  };

  clearDeck = () => {
    this.push([]);
  };

  selectMainGen = (index: number, genMain?: string) => {
    const deckCards = [...this.deckCards];
    const deckCard = deckCards[index];
    if (!deckCard || !('general' in deckCard)) {
      return;
    }
    deckCards[index] = {
      ...deckCard,
      genMain,
    };
    this.push(deckCards);
  };
}
