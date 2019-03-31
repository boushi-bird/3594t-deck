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
  enabledAddDeck: boolean;
  enableSearch: boolean;
  /** 総武力 */
  totalForce: number;
  /** 総知力 */
  totalIntelligence: number;
  /** 総知力将器加算値 */
  intelligenceByMainGen: number;
  /** 総征圧力 */
  totalConquest: number;
  /** 総征圧力将器加算値 */
  conquestByMainGen: number;
  /** 征圧ランク */
  conquestRank: string;
  /** 総コスト */
  totalCost: number;
  /** 上限コスト */
  limitCost: number;
  /** 最大士気 */
  maxMorale: number;
  /** 最大士気将器加算値 */
  maxMoraleByMainGen: number;
  /** 開幕士気 */
  startMorale: number;
  /** 開幕士気将器加算値 */
  startMoraleByMainGen: number;
  /** ダミー含む */
  hasDummy: boolean;
  /** 勢力未指定ダミー含む */
  hasStateDummy: boolean;
}

export interface DispatchFromProps {
  addDeckDummy: () => void;
  clearDeck: () => void;
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
      enabledAddDeck,
      enableSearch,
      totalForce,
      totalIntelligence,
      intelligenceByMainGen,
      totalConquest,
      conquestByMainGen,
      conquestRank,
      totalCost,
      limitCost,
      maxMorale,
      maxMoraleByMainGen,
      startMorale,
      startMoraleByMainGen,
      hasDummy,
      hasStateDummy,
      addDeckDummy,
      clearDeck,
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
          <div className="deck-actions">
            <div
              className={classNames('add-new-deck-card', 'button', {
                disabled: !enabledAddDeck,
              })}
              onClick={addDeckDummy}
            >
              追加
              <FontAwesomeIcon icon={faPlusCircle} />
            </div>
            <div className="deck-clear button" onClick={clearDeck}>
              クリア
            </div>
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
                active: intelligenceByMainGen > 0,
              })}
            >
              将器込み
            </span>
            <span className={classNames('intelligence', { dummy: hasDummy })}>
              {totalIntelligence}
              <span
                className={classNames('breakdown', {
                  active: intelligenceByMainGen > 0,
                })}
              >
                ({totalIntelligence - intelligenceByMainGen}
                <span className="addition-by-main-gen">
                  &#43;{intelligenceByMainGen}
                </span>
                )
              </span>
            </span>
          </div>
          <div className="total" data-label="総征圧力">
            <span
              className={classNames('has-gen-main', {
                active: conquestByMainGen > 0,
              })}
            >
              将器込み
            </span>
            <span className={classNames('conquest-rank', { dummy: hasDummy })}>
              {conquestRank}
            </span>
            <span className={classNames('conquest', { dummy: hasDummy })}>
              {totalConquest}
              <span
                className={classNames('breakdown', {
                  active: conquestByMainGen > 0,
                })}
              >
                ({totalConquest - conquestByMainGen}
                <span className="addition-by-main-gen">
                  &#43;{conquestByMainGen}
                </span>
                )
              </span>
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
                active: maxMoraleByMainGen > 0,
              })}
            >
              将器込み
            </span>
            <span
              className={classNames('max-morale', { dummy: hasStateDummy })}
            >
              {maxMorale}
              <span
                className={classNames('breakdown', {
                  active: maxMoraleByMainGen > 0,
                })}
              >
                ({maxMorale - maxMoraleByMainGen}
                <span className="addition-by-main-gen">
                  &#43;{maxMoraleByMainGen}
                </span>
                )
              </span>
            </span>
          </div>
          <div className="total" data-label="開幕士気">
            <span
              className={classNames('has-gen-main', {
                active: startMoraleByMainGen > 0,
              })}
            >
              将器込み
            </span>
            <span className="start-morale">
              {startMorale}
              <span
                className={classNames('breakdown', {
                  active: startMoraleByMainGen > 0,
                })}
              >
                ({startMorale - startMoraleByMainGen}
                <span className="addition-by-main-gen">
                  &#43;{startMoraleByMainGen}
                </span>
                )
              </span>
            </span>
          </div>
        </div>
      </div>
    );
  }
}
