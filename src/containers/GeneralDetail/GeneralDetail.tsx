import React from 'react';
import type { General } from '3594t-deck';
import type { StateBaseProps, DispatchBaseProps } from './GeneralDetailBase';
import GeneralDetailBase from './GeneralDetailBase';
import GeneralCard from '../../components/GeneralCard';

export interface StateFromProps extends StateBaseProps<General> {
  exchangeForceIntelligence: boolean;
}

export type DispatchFromProps = DispatchBaseProps;

export type Props = StateFromProps & DispatchFromProps;

export default class GeneralDetail extends GeneralDetailBase<General, Props> {
  protected createCardElement(general: General): JSX.Element {
    return (
      <GeneralCard
        general={general}
        showStrategyExplanation={false}
        showAddButtons={false}
        exchangeForceIntelligence={this.props.exchangeForceIntelligence}
      />
    );
  }

  protected getStratExplanation(general: General): string {
    return general.strategy.explanation;
  }

  protected getStratRangeCode(general: General): string | undefined {
    return general.strategy.stratRangeCode;
  }
}
