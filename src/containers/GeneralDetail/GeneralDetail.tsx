import './GeneralDetail.css';
import React from 'react';
import { General } from '3594t-deck';
import GeneralCard from '../../components/GeneralCard';

export interface Props {
  general?: General;
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
    return (
      <div className="general-detail">
        <div className="general-detail-inner">
          <GeneralCard
            general={general}
            showStrategyExplanation={false}
            showAddButtons={false}
          />
          <div className="general-detail-body">
            <div className="strategy-explanation" data-label="計略説明">
              {stratExplanationElements}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
