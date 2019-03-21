import './CardList.css';
import React from 'react';
import classNames from 'classnames';
import GeneralCard from '../../components/GeneralCard';
import { DatalistState } from '../../modules/datalist';

export interface StateFromProps {
  generals: DatalistState['generals'];
  searchedGeneralIds: string[];
  searchedAll: number;
  searchedOffset: number;
  searchedLimit: number;
  hasPrev: boolean;
  hasNext: boolean;
}

export interface DispatchFromProps {
  addDeckGeneral: (card: {
    general: string;
    cost: string;
    genMain?: string;
  }) => void;
  onPagePrev: () => void;
  onPageNext: () => void;
}

type Props = StateFromProps & DispatchFromProps;

export default class CardList extends React.PureComponent<Props> {
  private scrollArea = React.createRef<HTMLDivElement>();

  private handleOnAddDeck = (card: {
    general: string;
    cost: string;
    genMain?: string;
  }) => {
    this.props.addDeckGeneral(card);
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
      searchedAll,
      searchedOffset,
      searchedLimit,
      hasPrev,
      hasNext,
      onPagePrev,
      onPageNext,
    } = this.props;
    const generalCards: JSX.Element[] = [];
    const count = searchedGeneralIds.length;
    generals.forEach(general => {
      const show = searchedGeneralIds.includes(general.id);
      generalCards.push(
        <GeneralCard
          key={general.id}
          general={general}
          onAddDeck={this.handleOnAddDeck}
          show={show}
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
            onClick={onPagePrev}
          >
            &lt; 前
          </button>
          <div className="pageing-label">
            全{searchedAll}件 {start} - {end}件
          </div>
          <button
            className={classNames('paging-button', 'next', { active: hasNext })}
            onClick={onPageNext}
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
