import './DeckBoard.css';
import React from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons/faPlusCircle';
import DeckCard from '../../components/DeckCard';
import DeckDummyCard from '../DeckDummyCard';
import { DeckCard as DeckCardDummy } from '../../modules/deck';
import { General } from '../../services/mapBaseData';

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
  conquestRank: string;
  totalCost: number;
  limitCost: number;
  maxMorale: number;
  startMorale: number;
  hasGenMainMaxMorale: boolean;
  hasGenMainStartMorale: boolean;
  hasGenMainTotalIntelligence: boolean;
  hasGenMainTotalConquest: boolean;
  hasDummy: boolean;
  hasStateDummy: boolean;
}

export interface DispatchFromProps {
  addDeckDummy: () => void;
  selectMainGen: (index: number, genMain?: string) => void;
  setActiveCard: (index: number) => void;
  removeDeck: (index: number) => void;
  toggleSearch: (index: number) => void;
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
      enableSearch,
      totalForce,
      totalIntelligence,
      totalConquest,
      conquestRank,
      totalCost,
      limitCost,
      maxMorale,
      startMorale,
      hasGenMainMaxMorale,
      hasGenMainStartMorale,
      hasGenMainTotalIntelligence,
      hasGenMainTotalConquest,
      hasDummy,
      hasStateDummy,
      addDeckDummy,
      selectMainGen,
      setActiveCard,
      removeDeck,
      toggleSearch,
    } = this.props;
    const deckCardsElements: JSX.Element[] = [];
    deckCards.forEach((deckCard, i) => {
      const active = activeIndex === i;
      if ('cost' in deckCard) {
        deckCardsElements.push(
          <DeckDummyCard
            key={i}
            index={i}
            active={active}
            search={active && enableSearch}
            deckCard={deckCard}
            onActive={setActiveCard}
            onRemoveDeck={removeDeck}
            onToggleSearch={toggleSearch}
          />
        );
      } else {
        const { general, genMain } = deckCard;
        deckCardsElements.push(
          <DeckCard
            key={i}
            index={i}
            active={active}
            search={active && enableSearch}
            genMain={genMain}
            general={general}
            onSelectMainGen={selectMainGen}
            onActive={setActiveCard}
            onRemoveDeck={removeDeck}
            onToggleSearch={toggleSearch}
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
            <span
              className={classNames('has-gen-main', {
                active: hasGenMainTotalIntelligence,
              })}
            >
              将器込み
            </span>
            <span className={classNames('intelligence', { dummy: hasDummy })}>
              {totalIntelligence}
            </span>
          </div>
          <div className="total" data-label="総征圧力">
            <span
              className={classNames('has-gen-main', {
                active: hasGenMainTotalConquest,
              })}
            >
              将器込み
            </span>
            <span className={classNames('conquest-rank', { dummy: hasDummy })}>
              {conquestRank}
            </span>
            <span className={classNames('conquest', { dummy: hasDummy })}>
              {totalConquest}
            </span>
          </div>
          <div className="total total-cost" data-label="総コスト">
            <span className="cost">{totalCost.toFixed(1)}</span>
            <span className={classNames('cost-remain', { over, under })}>
              ({costRemainText} {costRemain.toFixed(1)})
            </span>
          </div>
          <div className="total" data-label="最大士気">
            <span
              className={classNames('has-gen-main', {
                active: hasGenMainMaxMorale,
              })}
            >
              将器込み
            </span>
            <span
              className={classNames('max-morale', { dummy: hasStateDummy })}
            >
              {maxMorale}
            </span>
          </div>
          <div className="total" data-label="開幕士気">
            <span
              className={classNames('has-gen-main', {
                active: hasGenMainStartMorale,
              })}
            >
              将器込み
            </span>
            <span className="start-morale">{startMorale}</span>
          </div>
        </div>
      </div>
    );
  }
}
