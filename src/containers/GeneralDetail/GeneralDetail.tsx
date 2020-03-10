import './GeneralDetail.css';
import React from 'react';
import { General } from '3594t-deck';
import GeneralCard from '../../components/GeneralCard';
import { DeckCardGeneral } from '../../modules/deck/query';

export interface StateFromProps {
  general?: General;
}

export interface DispatchFromProps {
  addDeckGeneral: (card: DeckCardGeneral) => void;
  enabledAddDeckGeneral: (general: General) => boolean;
}

export type Props = StateFromProps & DispatchFromProps;

export default class GeneralDetail extends React.PureComponent<Props> {
  private handleOnAddDeck = (card: DeckCardGeneral) => {
    this.props.addDeckGeneral(card);
  };

  public render(): React.ReactNode {
    const { general, enabledAddDeckGeneral } = this.props;
    if (!general) {
      return <></>;
    }
    const stratExplanation = general.strategy.explanation;
    const enabled = enabledAddDeckGeneral(general);
    const stratExplanationElements: JSX.Element[] = [];
    stratExplanation.split('\n').forEach((exp, i) => {
      stratExplanationElements.push(<span key={i}>{exp}</span>);
    });
    return (
      <div className="general-detail">
        <div className="general-detail-inner">
          <GeneralCard
            general={general}
            onAddDeck={this.handleOnAddDeck}
            enabledAddDeck={enabled}
            showStrategyExplanation={false}
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
