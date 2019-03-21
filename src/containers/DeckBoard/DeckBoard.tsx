import './DeckBoard.css';
import React from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons/faPlusCircle';
import DeckCard from '../../components/DeckCard';
import DeckDummyCard from '../DeckDummyCard';
import { DatalistState } from '../../modules/datalist';
import { DeckCard as DeckCardDummy } from '../../modules/deck';

type General = DatalistState['generals'][number];

export interface DeckCardGeneral {
  general: General;
  genMain?: string;
}

// general = generals.find(g => g.id === deckCard.general);

export interface StateFromProps {
  deckCards: (DeckCardGeneral | DeckCardDummy)[];
  activeIndex?: number;
  enableSearch: boolean;
  totalForce: number;
  totalIntelligence: number;
  totalConquest: number;
  totalCost: number;
  limitCost: number;
  hasDummy: boolean;
}

export interface DispatchFromProps {
  addDeckDummy: () => void;
  selectMainGen: (index: number, genMain?: string) => void;
  setActiveCard: (index: number) => void;
  removeDeck: (index: number) => void;
}

type Props = StateFromProps & DispatchFromProps;

export default class DeckBoard extends React.Component<Props> {
  public componentDidMount(): void {
    window.addEventListener('beforeunload', this.onBeforeUnload);
  }

  public componentWillUnmount(): void {
    window.removeEventListener('beforeunload', this.onBeforeUnload);
  }

  private onBeforeUnload = (event: Event): void => {
    if (this.props.deckCards.length > 0) {
      event.preventDefault();
      event.returnValue = true;
    }
  };

  public render(): React.ReactNode {
    const {
      deckCards,
      activeIndex,
      totalForce,
      totalIntelligence,
      totalConquest,
      totalCost,
      limitCost,
      hasDummy,
      addDeckDummy,
      selectMainGen,
      setActiveCard,
      removeDeck,
    } = this.props;
    const deckCardsElements: JSX.Element[] = [];
    deckCards.forEach((deckCard, i) => {
      const active = activeIndex === i;
      if ('cost' in deckCard) {
        console.log(deckCard);
        deckCardsElements.push(
          <DeckDummyCard
            key={i}
            index={i}
            active={active}
            deckCard={deckCard}
          />
        );
      } else {
        const { general, genMain } = deckCard;
        deckCardsElements.push(
          <DeckCard
            key={i}
            index={i}
            active={active}
            genMain={genMain}
            general={general}
            onSelectMainGen={selectMainGen}
            onActive={setActiveCard}
            onRemoveDeck={removeDeck}
          />
        );
      }
    });
    let costRemain = totalCost - limitCost;
    let costRemainText = '残り';
    let over = false;
    let under = false;
    if (costRemain > 0) {
      costRemainText = 'コストオーバー';
      over = true;
    } else if (costRemain < 0) {
      costRemain *= -1;
      under = true;
    }
    let conquestRank;
    if (totalConquest >= 11) {
      conquestRank = 'S';
    } else if (totalConquest >= 9) {
      conquestRank = 'A';
    } else if (totalConquest >= 7) {
      conquestRank = 'B';
    } else {
      conquestRank = 'C';
    }
    return (
      <div className="deck-board">
        <div className="deck-card-list">
          {deckCardsElements}
          <div className="add-new-deck-card button" onClick={addDeckDummy}>
            追加
            <FontAwesomeIcon icon={faPlusCircle} />
          </div>
        </div>
        <div className="deck-total">
          <div className="total" data-label="総武力">
            <span className={classNames('force', { dummy: hasDummy })}>
              {totalForce}
            </span>
          </div>
          <div className="total" data-label="総知力">
            <span className={classNames('intelligence', { dummy: hasDummy })}>
              {totalIntelligence}
            </span>
          </div>
          <div className="total" data-label="総征圧力">
            <span className={classNames('conquest-rank', { dummy: hasDummy })}>
              {conquestRank}
            </span>
            <span className={classNames('conquest', { dummy: hasDummy })}>
              {totalConquest}
            </span>
          </div>
          <div className="total" data-label="総コスト">
            <span className="cost">{totalCost.toFixed(1)}</span>
            <span className={classNames('cost-remain', { over, under })}>
              ({costRemainText} {costRemain.toFixed(1)})
            </span>
          </div>
        </div>
      </div>
    );
  }
}
