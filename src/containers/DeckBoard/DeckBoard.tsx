import './DeckBoard.css';
import React from 'react';
import DeckCard from '../../components/DeckCard';
import { DatalistState } from '../../modules/datalist';
import { DeckState } from '../../modules/deck';

type General = DatalistState['generals'][number];

export interface StateFromProps extends DeckState {
  generals: General[];
}

export interface DispatchFromProps {
  selectMainGen: (index: number, genMain?: string) => void;
}

type Props = StateFromProps & DispatchFromProps;

export default class DeckBoard extends React.Component<Props> {
  public render(): React.ReactNode {
    const { deckCards, generals, selectMainGen } = this.props;
    const deckCardsElements: JSX.Element[] = [];
    deckCards.forEach((deckCard, i) => {
      let general: General | undefined;
      if (deckCard.general) {
        general = generals.find(g => g.id === deckCard.general);
      }
      if (general) {
        deckCardsElements.push(
          <DeckCard
            key={i}
            index={i}
            genMain={deckCard.genMain}
            general={general}
            onSelectMainGen={selectMainGen}
          />
        );
      }
    });
    return <div className="deck-card-list">{deckCardsElements}</div>;
  }
}
