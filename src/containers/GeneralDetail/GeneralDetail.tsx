import './GeneralDetail.css';
import React from 'react';
import type { General } from '3594t-deck';
import GeneralCard from '../../components/GeneralCard';
import { strategyRangeImageUrl } from '../../utils/externalUrl';

export interface Props {
  general: General | null;
}

export default class GeneralDetail extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { general } = this.props;
    if (!general) {
      return <></>;
    }
    const stratExplanation = general.strategy.explanation;
    const stratExplanationElements: JSX.Element[] = [];
    stratExplanation.split('\n').forEach((exp, i) => {
      stratExplanationElements.push(<span key={i}>{exp}</span>);
    });
    const strategyRangeUrl = strategyRangeImageUrl(
      general.strategy.stratRangeCode
    );
    return (
      <div className="general-detail">
        <div className="general-detail-inner">
          <GeneralCard
            general={general}
            showStrategyExplanation={false}
            showAddButtons={false}
          />
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
