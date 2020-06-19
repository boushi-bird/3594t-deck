import './DeckBoard.css';
import React from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons/faPlusCircle';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import type { General, AssistGeneral } from '3594t-deck';
import AssistDeckCard from '../../components/AssistDeckCard';
import DeckCard from '../../components/DeckCard';
import DeckDummyCard from '../DeckDummyCard';
import type { DeckCardGeneral, DeckCardDummy } from '../../modules/deck';

interface DeckCardGeneralInfo extends Omit<DeckCardGeneral, 'general'> {
  general: General;
  genMainAwakingCount: number;
  additionalParams: {
    force: number;
    intelligence: number;
    conquest: number;
  };
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
  intelligenceByGenMain: number;
  /** 総征圧力 */
  totalConquest: number;
  /** 総征圧力将器加算値 */
  conquestByGenMain: number;
  /** 征圧ランク */
  conquestRank: string;
  /** 総コスト */
  totalCost: number;
  /** 上限コスト */
  limitCost: number;
  /** 最大士気 */
  maxMorale: number;
  /** 最大士気将器加算値 */
  maxMoraleByGenMain: number;
  /** 魅力による士気 */
  tolalMoraleByCharm: number;
  /** 主将器による士気 */
  tolalMoraleByGenMain: number;
  /** ダミー含む */
  hasDummy: boolean;
  /** 勢力未指定ダミー含む */
  hasStateDummy: boolean;
  /** 覚醒済み将器ポイント */
  totalAwakingGenMainCount: number;
  /** 覚醒できる主将器の最大ポイント数 */
  genMainAwakingLimit: number;
}

export interface DispatchFromProps {
  addDeckDummy: () => void;
  clearDeck: () => void;
  openDeckConfig: () => void;
  selectGenMain: (index: number, genMain?: string) => void;
  awakeGenMain: (index: number, awake: boolean) => void;
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
  showDetail: (general: General) => void;
  showAssistDetail: (assist: AssistGeneral) => void;
  moveLeft: (index: number) => void;
  moveRight: (index: number) => void;
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
      showAssistDetail,
      openDeckConfig,
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
          onShowDetail={showAssistDetail}
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
        <div className="open-deck-config button" onClick={openDeckConfig}>
          <FontAwesomeIcon icon={faCog} />
        </div>
      </div>
    );
  }

  private renderDeckCardList(): React.ReactNode {
    const {
      deckCards,
      activeIndex,
      enableSearch,
      enabledAddDeck,
      totalAwakingGenMainCount,
      genMainAwakingLimit,
      assistDeckCards,
      addDeckDummy,
      clearDeck,
      openDeckConfig,
      selectGenMain,
      awakeGenMain,
      setActiveCard,
      removeDeck,
      toggleSearch,
      showDetail,
      moveLeft,
      moveRight,
    } = this.props;
    const deckCardsElements: JSX.Element[] = [];
    deckCards.forEach((deckCard, i) => {
      const active = activeIndex === i;
      const firstCard = i === 0;
      const lastCard = i === deckCards.length - 1;
      const key = deckCard.key;
      if ('general' in deckCard) {
        const {
          general,
          additionalParams,
          genMain,
          genMainAwaking,
          genMainAwakingCount,
          pocket,
        } = deckCard;
        const enableGenMainAwake =
          genMainAwaking ||
          genMainAwakingLimit >= genMainAwakingCount + totalAwakingGenMainCount;
        deckCardsElements.push(
          <DeckCard
            key={key}
            index={i}
            active={active}
            search={active && enableSearch}
            genMain={genMain}
            genMainAwaking={genMainAwaking}
            genMainAwakingCount={genMainAwakingCount}
            general={general}
            additionalParams={additionalParams}
            pocket={pocket}
            enableMoveLeft={!firstCard}
            enableMoveRight={!lastCard}
            enableGenMainAwake={enableGenMainAwake}
            onSelectGenMain={selectGenMain}
            onAwakeGenMain={awakeGenMain}
            onActive={setActiveCard}
            onRemoveDeck={removeDeck}
            onToggleSearch={toggleSearch}
            onShowDetail={showDetail}
            onMoveLeft={moveLeft}
            onMoveRight={moveRight}
          />
        );
      } else {
        deckCardsElements.push(
          <DeckDummyCard
            key={key}
            index={i}
            active={active}
            search={active && enableSearch}
            deckCard={deckCard}
            enableMoveLeft={!firstCard}
            enableMoveRight={!lastCard}
            onActive={setActiveCard}
            onRemoveDeck={removeDeck}
            onToggleSearch={toggleSearch}
            onMoveLeft={moveLeft}
            onMoveRight={moveRight}
          />
        );
      }
    });
    const deckConfigStyle: React.CSSProperties = {};
    if (assistDeckCards.length > 0) {
      deckConfigStyle.display = 'none';
    }
    return (
      <div className="deck-card-list">
        {deckCardsElements}
        <div className="deck-actions">
          <div className="deck-clear button" onClick={clearDeck}>
            クリア
          </div>
          <div
            className={classNames('add-new-deck-card', 'button', {
              disabled: !enabledAddDeck,
            })}
            onClick={addDeckDummy}
          >
            追加
            <FontAwesomeIcon icon={faPlusCircle} />
          </div>
          <div
            style={deckConfigStyle}
            className="open-deck-config button"
            onClick={openDeckConfig}
          >
            <FontAwesomeIcon icon={faCog} />
          </div>
          <div
            className={classNames('deck-awaking-gen-main', {
              'over-limit': totalAwakingGenMainCount > genMainAwakingLimit,
            })}
            data-label="将器ポイント"
          >
            {totalAwakingGenMainCount}/{genMainAwakingLimit}
          </div>
        </div>
      </div>
    );
  }

  private renderDeckTotal(): React.ReactNode {
    const {
      totalForce,
      totalIntelligence,
      intelligenceByGenMain,
      totalConquest,
      conquestByGenMain,
      conquestRank,
      totalCost,
      limitCost,
      maxMorale,
      maxMoraleByGenMain,
      tolalMoraleByCharm,
      tolalMoraleByGenMain,
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
    const startMorale = (tolalMoraleByCharm + tolalMoraleByGenMain) / 100;
    const startMoraleByCharm = tolalMoraleByCharm / 100;
    const startMoraleByGenMain = tolalMoraleByGenMain / 100;
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
              active: intelligenceByGenMain > 0,
            })}
          >
            将器込み
          </span>
          <span className={classNames('intelligence', { dummy: hasDummy })}>
            {totalIntelligence}
            <span
              className={classNames('breakdown', {
                active: intelligenceByGenMain > 0,
              })}
            >
              ({totalIntelligence - intelligenceByGenMain}
              <span className="addition-by-gen-main">
                &#43;{intelligenceByGenMain}
              </span>
              )
            </span>
          </span>
        </div>
        <div className="total" data-label="総征圧力">
          <span
            className={classNames('has-gen-main', {
              active: conquestByGenMain > 0,
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
                active: conquestByGenMain > 0,
              })}
            >
              ({totalConquest - conquestByGenMain}
              <span className="addition-by-gen-main">
                &#43;{conquestByGenMain}
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
              active: maxMoraleByGenMain > 0,
            })}
          >
            将器込み
          </span>
          <span className={classNames('max-morale', { dummy: hasStateDummy })}>
            {maxMorale}
            <span
              className={classNames('breakdown', {
                active: maxMoraleByGenMain > 0,
              })}
            >
              ({maxMorale - maxMoraleByGenMain}
              <span className="addition-by-gen-main">
                &#43;{maxMoraleByGenMain}
              </span>
              )
            </span>
          </span>
        </div>
        <div className="total" data-label="開幕士気">
          <span
            className={classNames('has-gen-main', {
              active: startMoraleByGenMain > 0,
            })}
          >
            将器込み
          </span>
          <span className="start-morale">
            {startMorale}
            <span
              className={classNames('breakdown', {
                active: startMoraleByGenMain > 0,
              })}
            >
              ({startMoraleByCharm}
              <span className="addition-by-gen-main">
                &#43;{startMoraleByGenMain}
              </span>
              )
            </span>
          </span>
        </div>
      </div>
    );
  }
}
