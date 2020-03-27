import './DeckBoard.css';
import React from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons/faPlusCircle';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import { General, AssistGeneral } from '3594t-deck';
import AssistDeckCard from '../../components/AssistDeckCard';
import DeckCard from '../../components/DeckCard';
import DeckDummyCard from '../DeckDummyCard';
import { DeckCardGeneral, DeckCardDummy } from '../../modules/deck';

interface DeckCardGeneralInfo
  extends Pick<DeckCardGeneral, 'genMain' | 'pocket'> {
  general: General;
}

export interface DeckCardAssistInfo {
  assist: AssistGeneral | null;
}

export type DeckCardInfo = DeckCardGeneralInfo | DeckCardDummy;

export interface StateFromProps {
  deckCards: DeckCardInfo[];
  assistDeckCards: DeckCardAssistInfo[];
  activeIndex: number | null;
  activeAssistIndex: number | null;
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
  /** 魅力による士気 */
  tolalMoraleByCharm: number;
  /** 主将器による士気 */
  tolalMoraleByMainGen: number;
  /** ダミー含む */
  hasDummy: boolean;
  /** 勢力未指定ダミー含む */
  hasStateDummy: boolean;
}

export interface DispatchFromProps {
  addDeckDummy: () => void;
  clearDeck: () => void;
  openDeckConfig: () => void;
  selectMainGen: (index: number, genMain?: string) => void;
  setActiveCard: (index: number) => void;
  removeDeck: (index: number) => void;
  toggleSearch: (
    index: number,
    condition: {
      belongState?: string;
      cost: string;
      unitType?: string;
    }
  ) => void;
  setActiveAssistCard: (index: number) => void;
  removeDeckAssist: (index: number) => void;
}

export type Props = StateFromProps & DispatchFromProps;

export default class DeckBoard extends React.Component<Props> {
  public render(): React.ReactNode {
    return (
      <div className="deck-board">
        {this.renderAssistDeckCardList()}
        {this.renderDeckCardList()}
        {this.renderDeckTotal()}
      </div>
    );
  }

  private renderAssistDeckCardList(): React.ReactNode {
    const {
      assistDeckCards,
      activeAssistIndex,
      setActiveAssistCard,
      removeDeckAssist,
    } = this.props;
    const assistDeckCardsElements: JSX.Element[] = [];
    assistDeckCards.forEach((assistDeckCard, i) => {
      const active = activeAssistIndex === i;
      assistDeckCardsElements.push(
        <AssistDeckCard
          key={i}
          index={i}
          assist={assistDeckCard.assist}
          active={active}
          onActive={setActiveAssistCard}
          onRemoveDeck={removeDeckAssist}
        />
      );
    });
    const style: React.CSSProperties = {};
    if (assistDeckCards.length === 0) {
      style.display = 'none';
    }
    return (
      <div className="assist-deck-card-list" style={style}>
        {assistDeckCardsElements}
      </div>
    );
  }

  private renderDeckCardList(): React.ReactNode {
    const {
      deckCards,
      activeIndex,
      enableSearch,
      enabledAddDeck,
      addDeckDummy,
      clearDeck,
      openDeckConfig,
      selectMainGen,
      setActiveCard,
      removeDeck,
      toggleSearch,
    } = this.props;
    const deckCardsElements: JSX.Element[] = [];
    deckCards.forEach((deckCard, i) => {
      const active = activeIndex === i;
      if ('general' in deckCard) {
        const { general, genMain, pocket } = deckCard;
        deckCardsElements.push(
          <DeckCard
            key={i}
            index={i}
            active={active}
            search={active && enableSearch}
            genMain={genMain}
            general={general}
            pocket={pocket}
            onSelectMainGen={selectMainGen}
            onActive={setActiveCard}
            onRemoveDeck={removeDeck}
            onToggleSearch={toggleSearch}
          />
        );
      } else {
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
      }
    });
    return (
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
          <div className="open-deck-config button" onClick={openDeckConfig}>
            <FontAwesomeIcon icon={faCog} />
          </div>
        </div>
      </div>
    );
  }

  private renderDeckTotal(): React.ReactNode {
    const {
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
      tolalMoraleByCharm,
      tolalMoraleByMainGen,
      hasDummy,
      hasStateDummy,
    } = this.props;
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
    // 開幕士気
    const startMorale = (tolalMoraleByCharm + tolalMoraleByMainGen) / 100;
    const startMoraleByCharm = tolalMoraleByCharm / 100;
    const startMoraleByMainGen = tolalMoraleByMainGen / 100;
    return (
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
          <span className="cost">{(totalCost / 10).toFixed(1)}</span>
          <span className={classNames('cost-remain', { over, under })}>
            ({costRemainText} {(costRemain / 10).toFixed(1)})
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
          <span className={classNames('max-morale', { dummy: hasStateDummy })}>
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
              ({startMoraleByCharm}
              <span className="addition-by-main-gen">
                &#43;{startMoraleByMainGen}
              </span>
              )
            </span>
          </span>
        </div>
      </div>
    );
  }
}
