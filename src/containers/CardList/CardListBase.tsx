import './CardList.css';
import React from 'react';
import { forceCheck } from 'react-lazyload';
import classNames from 'classnames';

export interface StateBaseProps {
  count: number;
  searchedAll: number;
  searchedOffset: number;
  searchedLimit: number;
  hasPrev: boolean;
  hasNext: boolean;
  show: boolean;
}

export interface DispatchBaseProps {
  onPagePrev: () => void;
  onPageNext: () => void;
}

type BaseProps = StateBaseProps & DispatchBaseProps;

export default abstract class CardListBase<
  PROP extends BaseProps,
  STAT = {}
> extends React.PureComponent<PROP, STAT> {
  protected scrollArea = React.createRef<HTMLDivElement>();

  protected handleOnPagePrev = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ): void => {
    event.stopPropagation();
    this.props.onPagePrev();
  };

  protected handleOnPageNext = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ): void => {
    event.stopPropagation();
    this.props.onPageNext();
  };

  protected handleOnScroll = (): void => {
    forceCheck();
  };

  public componentDidUpdate(prevProps: Readonly<PROP>): void {
    const changed = this.isChangedList(prevProps);
    const scrollArea = this.scrollArea.current;
    if (changed && scrollArea) {
      scrollArea.scrollTop = 0;
    }
    forceCheck();
  }

  protected abstract createCardElements(): JSX.Element[];
  protected abstract isChangedList(prevProps: Readonly<PROP>): boolean;

  protected extraPartRender(): JSX.Element {
    return <></>;
  }

  public render(): React.ReactNode {
    const {
      count,
      searchedAll,
      searchedOffset,
      searchedLimit,
      hasPrev,
      hasNext,
      show,
    } = this.props;
    const cards: JSX.Element[] = this.createCardElements();
    if (count === 0) {
      cards.push(
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
    const style: React.CSSProperties = {};
    if (!show) {
      style.display = 'none';
    }
    return (
      <div
        className="cardlist-container"
        style={style}
        onScroll={this.handleOnScroll}
      >
        {this.extraPartRender()}
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
          {cards}
        </div>
      </div>
    );
  }
}
