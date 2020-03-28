import React from 'react';
import { AssistGeneral } from '3594t-deck';
import CardListBase, {
  StateBaseProps,
  DispatchBaseProps,
} from '../CardList/CardListBase';
import AssistGeneralCard from '../../components/AssistGeneralCard';

export interface StateFromProps extends StateBaseProps {
  assistGenerals: AssistGeneral[];
  searchedAssistGeneralIds: string[];
  showStrategyExplanation: boolean;
}

export interface DispatchFromProps extends DispatchBaseProps {
  showGeneralDetail: (assistGgeneral: AssistGeneral) => void;
}

export type Props = StateFromProps & DispatchFromProps;

export default class AssitCardList extends CardListBase<Props> {
  private handleOnShowDetail = (assistGgeneral: AssistGeneral) => {
    this.props.showGeneralDetail(assistGgeneral);
  };

  protected createCardElements(): JSX.Element[] {
    const {
      assistGenerals,
      searchedAssistGeneralIds,
      showStrategyExplanation,
    } = this.props;
    const generalCards: JSX.Element[] = [];
    assistGenerals.forEach((assistGeneral) => {
      const show = searchedAssistGeneralIds.includes(assistGeneral.id);
      generalCards.push(
        <AssistGeneralCard
          key={assistGeneral.id}
          general={assistGeneral}
          onShowDetail={this.handleOnShowDetail}
          show={show}
          showStrategyExplanation={showStrategyExplanation}
          showAddButtons={true}
        />
      );
    });
    return generalCards;
  }

  protected isChangedList(prevProps: Readonly<Props>): boolean {
    const next = this.props.searchedAssistGeneralIds;
    const prev = prevProps.searchedAssistGeneralIds;
    const notChanged =
      next.length === prev.length && next.every((v) => prev.includes(v));
    return !notChanged;
  }
}
