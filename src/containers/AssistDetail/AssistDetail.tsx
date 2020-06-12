import React from 'react';
import type { AssistGeneral } from '3594t-deck';
import type {
  StateBaseProps,
  DispatchBaseProps,
} from '../GeneralDetail/GeneralDetailBase';
import GeneralDetailBase from '../GeneralDetail/GeneralDetailBase';
import AssistGeneralCard from '../../components/AssistGeneralCard';

export type StateFromProps = StateBaseProps<AssistGeneral>;

export type DispatchFromProps = DispatchBaseProps;

export type Props = StateFromProps & DispatchFromProps;

export default class AssistDetail extends GeneralDetailBase<
  AssistGeneral,
  Props
> {
  protected createCardElement(general: AssistGeneral): JSX.Element {
    return (
      <AssistGeneralCard
        general={general}
        showStrategyExplanation={false}
        showAddButtons={false}
      />
    );
  }

  protected getStratExplanation(general: AssistGeneral): string {
    return general.strategy.explanation;
  }

  protected getStratRangeCode(general: AssistGeneral): string | undefined {
    return general.strategy.range?.code;
  }
}
