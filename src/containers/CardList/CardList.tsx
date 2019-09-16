import './CardList.css';
import React from 'react';
import { forceCheck } from 'react-lazyload';
import classNames from 'classnames';
import GeneralCard from '../../components/GeneralCard';
import { DeckCardGeneral } from '../../modules/deck/query';
import { General } from '../../interfaces';

export interface StateFromProps {
  generals: General[];
  searchedGeneralIds: string[];
  searchedAll: number;
  searchedOffset: number;
  searchedLimit: number;
  hasPrev: boolean;
  hasNext: boolean;
  showStrategyExplanation: boolean;
}

export interface DispatchFromProps {
  addDeckGeneral: (card: DeckCardGeneral) => void;
  onPagePrev: () => void;
  onPageNext: () => void;
  enabledAddDeckGeneral: (general: General) => boolean;
}

type Props = StateFromProps & DispatchFromProps;

export default class CardList extends React.PureComponent<Props> {
  private scrollArea = React.createRef<HTMLDivElement>();

  private handleOnAddDeck = (card: DeckCardGeneral) => {
    this.props.addDeckGeneral(card);
  };

  private handleOnPagePrev = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    event.stopPropagation();
    this.props.onPagePrev();
  };

  private handleOnPageNext = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    event.stopPropagation();
    this.props.onPageNext();
  };

  private handleOnScroll = () => {
    forceCheck();
  };

  public componentDidUpdate(prevProps: Readonly<Props>): void {
    const next = this.props.searchedGeneralIds;
    const prev = prevProps.searchedGeneralIds;
    const notChanged =
      next.length === prev.length && next.every(v => prev.includes(v));
    const scrollArea = this.scrollArea.current;
    if (!notChanged && scrollArea) {
      scrollArea.scrollTop = 0;
    }
    forceCheck();
  }

  public render(): React.ReactNode {
    const {
      generals,
      searchedGeneralIds,
      searchedAll,
      searchedOffset,
      searchedLimit,
      hasPrev,
      hasNext,
      showStrategyExplanation,
      enabledAddDeckGeneral,
    } = this.props;
    const generalCards: JSX.Element[] = [];
    const count = searchedGeneralIds.length;
    generals.forEach(general => {
      const show = searchedGeneralIds.includes(general.id);
      const enabled = enabledAddDeckGeneral(general);
      generalCards.push(
        <GeneralCard
          key={general.id}
          general={general}
          onAddDeck={this.handleOnAddDeck}
          show={show}
          enabledAddDeck={enabled}
          showStrategyExplanation={showStrategyExplanation}
        />
      );
    });
    if (count === 0) {
      generalCards.push(
        <div key={-1} className="no-generals">
          該当なし
        </div>
      );
    }
    const start = searchedAll > 0 ? searchedOffset + 1 : 0;
    let end = searchedOffset + searchedLimit;
    if (end > searchedAll) {
      end = searchedAll;
    }
    return (
      <div className="cardlist-container" onScroll={this.handleOnScroll}>
        <div className="cardlist-paging">
          <button
            className={classNames('paging-button', 'prev', { active: hasPrev })}
            onClick={this.handleOnPagePrev}
          >
            &lt; 前
          </button>
          <div className="pageing-label">
            全{searchedAll}件 {start} - {end}件
          </div>
          <button
            className={classNames('paging-button', 'next', { active: hasNext })}
            onClick={this.handleOnPageNext}
          >
            次 &gt;
          </button>
        </div>
        <div className="cardlist-main" ref={this.scrollArea}>
          {generalCards}
        </div>
      </div>
    );
  }
}
