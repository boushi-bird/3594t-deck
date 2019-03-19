import './DeckBoard.css';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons/faPlusCircle';
import DeckCard from '../../components/DeckCard';
import DeckDummyCard from '../DeckDummyCard';
import { DatalistState } from '../../modules/datalist';
import { DeckState } from '../../modules/deck';

type General = DatalistState['generals'][number];

export interface StateFromProps extends DeckState {
  generals: General[];
}

export interface DispatchFromProps {
  addDeckDummy: () => void;
  selectMainGen: (index: number, genMain?: string) => void;
  setActiveCard: (index: number) => void;
  removeDeck: (index: number) => void;
}

type Props = StateFromProps & DispatchFromProps;

export default class DeckBoard extends React.Component<Props> {
  public render(): React.ReactNode {
    const {
      deckCards,
      activeIndex,
      generals,
      addDeckDummy,
      selectMainGen,
      setActiveCard,
      removeDeck,
    } = this.props;
    const deckCardsElements: JSX.Element[] = [];
    deckCards.forEach((deckCard, i) => {
      let general: General | undefined;
      if (deckCard.general) {
        general = generals.find(g => g.id === deckCard.general);
      }
      const active = activeIndex === i;
      if (general) {
        deckCardsElements.push(
          <DeckCard
            key={i}
            index={i}
            active={active}
            genMain={deckCard.genMain}
            general={general}
            onSelectMainGen={selectMainGen}
            onActive={setActiveCard}
            onRemoveDeck={removeDeck}
          />
        );
      } else {
        deckCardsElements.push(
          <DeckDummyCard
            key={i}
            index={i}
            active={active}
            deckCard={deckCard}
          />
        );
      }
    });
    return (
      <div className="deck-board">
        <div className="deck-card-list">
          {deckCardsElements}
          <div className="add-new-deck-card button" onClick={addDeckDummy}>
            追加
            <FontAwesomeIcon icon={faPlusCircle} />
          </div>
        </div>
        <div className="deck-total" />
      </div>
    );
  }
}
