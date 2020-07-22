import './DeckBoard.css';
import React from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons/faPlusCircle';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import type { General, AssistGeneral } from '3594t-deck';
import AssistDeckCard from '../../components/AssistDeckCard';
import DeckCard from '../../components/DeckCard';
import DeckTotal from '../../components/DeckTotal';
import DeckDummyCard from '../DeckDummyCard';
import type { DeckCardGeneral, DeckCardDummy } from '../../modules/deck';

interface DeckCardGeneralInfo extends Omit<DeckCardGeneral, 'general'> {
  general: General;
  genMainAwakeningCount: number;
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
  total: DeckTotal['props'];
  /** 覚醒済み将器ポイント */
  totalAwakeningGenMainCount: number;
  /** 覚醒できる主将器の最大ポイント数 */
  genMainAwakeningLimit: number;
  /** 知勇一転 */
  exchangeForceIntelligence: boolean;
  /** デッキ設定を変更しているか */
  modifiedDeckConstraints: boolean;
}

export interface DispatchFromProps {
  addDeckDummy: () => void;
  clearDeck: () => void;
  openDeckConfig: () => void;
  selectGenMain: (index: number, genMain?: string) => void;
  awakenGenMain: (index: number, awaken: boolean) => void;
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
    const total = this.props.exchangeForceIntelligence
      ? {
          ...this.props.total,
          totalForce: this.props.total.totalIntelligence,
          totalIntelligence: this.props.total.totalForce,
        }
      : this.props.total;
    return (
      <div className="deck-board">
        {this.renderAssistDeckCardList()}
        {this.renderDeckCardList()}
        <DeckTotal {...total} />
      </div>
    );
  }

  private renderAssistDeckCardList(): React.ReactNode {
    const {
      assistDeckCards,
      activeAssistIndex,
      modifiedDeckConstraints,
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
        <div
          className={classNames('open-deck-config', 'button', {
            modified: modifiedDeckConstraints,
          })}
          onClick={openDeckConfig}
        >
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
      totalAwakeningGenMainCount,
      genMainAwakeningLimit,
      assistDeckCards,
      exchangeForceIntelligence,
      modifiedDeckConstraints,
      addDeckDummy,
      clearDeck,
      openDeckConfig,
      selectGenMain,
      awakenGenMain,
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
          genMainAwakening,
          genMainAwakeningCount,
          pocket,
        } = deckCard;
        const enableGenMainAwaken =
          genMainAwakening ||
          genMainAwakeningLimit >=
            genMainAwakeningCount + totalAwakeningGenMainCount;
        deckCardsElements.push(
          <DeckCard
            key={key}
            index={i}
            active={active}
            search={active && enableSearch}
            genMain={genMain}
            genMainAwakening={genMainAwakening}
            genMainAwakeningCount={genMainAwakeningCount}
            general={general}
            additionalParams={additionalParams}
            pocket={pocket}
            enableMoveLeft={!firstCard}
            enableMoveRight={!lastCard}
            enableGenMainAwaken={enableGenMainAwaken}
            exchangeForceIntelligence={exchangeForceIntelligence}
            onSelectGenMain={selectGenMain}
            onAwakenGenMain={awakenGenMain}
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
            className={classNames('open-deck-config', 'button', {
              modified: modifiedDeckConstraints,
            })}
            onClick={openDeckConfig}
          >
            <FontAwesomeIcon icon={faCog} />
          </div>
          <div
            className={classNames('deck-awakening-gen-main', {
              'over-limit': totalAwakeningGenMainCount > genMainAwakeningLimit,
            })}
            data-label="将器ポイント"
          >
            {totalAwakeningGenMainCount}/{genMainAwakeningLimit}
          </div>
        </div>
      </div>
    );
  }
}
