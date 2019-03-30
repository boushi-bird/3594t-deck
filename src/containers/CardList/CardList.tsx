import './CardList.css';
import React from 'react';
import classNames from 'classnames';
import GeneralCard from '../../components/GeneralCard';
import { DatalistState } from '../../modules/datalist';
import { DeckCardGeneral } from '../../modules/deck';

export interface StateFromProps {
  generals: DatalistState['generals'];
  searchedGeneralIds: string[];
  deckPersonals: string[];
  searchedAll: number;
  searchedOffset: number;
  searchedLimit: number;
  hasPrev: boolean;
  hasNext: boolean;
  enabledAddDeck: boolean;
}

export interface DispatchFromProps {
  addDeckGeneral: (card: DeckCardGeneral) => void;
  onPagePrev: () => void;
  onPageNext: () => void;
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

  public componentDidUpdate(prevProps: Readonly<Props>): void {
    const next = this.props.searchedGeneralIds;
    const prev = prevProps.searchedGeneralIds;
    const notChanged =
      next.length === prev.length && next.every(v => prev.includes(v));
    const scrollArea = this.scrollArea.current;
    if (!notChanged && scrollArea) {
      scrollArea.scrollTop = 0;
    }
  }

  public render(): React.ReactNode {
    const {
      generals,
      searchedGeneralIds,
      deckPersonals,
      searchedAll,
      searchedOffset,
      searchedLimit,
      hasPrev,
      hasNext,
      enabledAddDeck,
    } = this.props;
    const generalCards: JSX.Element[] = [];
    const count = searchedGeneralIds.length;
    generals.forEach(general => {
      const show = searchedGeneralIds.includes(general.id);
      const enabled =
        enabledAddDeck && !deckPersonals.includes(general.raw.personal);
      generalCards.push(
        <GeneralCard
          key={general.id}
          general={general}
          onAddDeck={this.handleOnAddDeck}
          show={show}
          enabledAddDeck={enabled}
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
      <div className="cardlist-container">
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
