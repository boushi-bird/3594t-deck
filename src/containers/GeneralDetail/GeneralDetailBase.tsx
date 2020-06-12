import './GeneralDetail.css';
import React from 'react';
import { strategyRangeImageUrl } from '../../utils/externalUrl';

export interface StateBaseProps<C> {
  card: C | null;
}

export interface DispatchBaseProps {
  close: () => void;
}

export default abstract class GeneralDetailBase<
  CARD,
  PROP extends StateBaseProps<CARD> & DispatchBaseProps,
  STAT = {}
> extends React.PureComponent<PROP, STAT> {
  protected abstract createCardElement(card: CARD): JSX.Element;
  protected abstract getStratExplanation(card: CARD): string;
  protected abstract getStratRangeCode(card: CARD): string | undefined;

  public render(): React.ReactNode {
    const card: CARD | null = this.props.card;
    if (card == null) {
      return <></>;
    }
    const cardElement = this.createCardElement(card);
    const stratExplanation = this.getStratExplanation(card);
    const stratRangeCode = this.getStratRangeCode(card);
    const stratExplanationElements: JSX.Element[] = [];
    stratExplanation.split('\n').forEach((exp, i) => {
      stratExplanationElements.push(<span key={i}>{exp}</span>);
    });
    const strategyRangeUrl = stratRangeCode
      ? strategyRangeImageUrl(stratRangeCode)
      : '';
    return (
      <div className="general-detail">
        <div className="general-detail-inner">
          {cardElement}
          <div className="general-detail-body">
            <div className="row">
              <div className="strategy-explanation" data-label="計略説明">
                {stratExplanationElements}
              </div>
              <div className="strategy-range" data-label="計略範囲">
                <img className="range-image" src={strategyRangeUrl} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
