import React from 'react';
import type { General } from '3594t-deck';
import { nextTick } from '../../utils/sleep';
import type { StateBaseProps, DispatchBaseProps } from './CardListBase';
import CardListBase from './CardListBase';
import GeneralCard from '../../components/GeneralCard';

export interface StateFromProps extends StateBaseProps {
  generals: General[];
  searchedGeneralIds: string[];
  showStrategyExplanation: boolean;
}

export interface DispatchFromProps extends DispatchBaseProps {
  showGeneralDetail: (general: General) => void;
}

export type Props = StateFromProps & DispatchFromProps;

interface LocalState {
  renderingCount: number;
}

export default class CardList extends CardListBase<Props, LocalState> {
  state: Readonly<LocalState> = { renderingCount: 0 };

  public async componentDidUpdate(prevProps: Readonly<Props>): Promise<void> {
    const { generals } = this.props;
    if (generals.length !== prevProps.generals.length) {
      // 武将リストのレンダリングが重すぎるので少しずつレンダリングさせる。
      const incRender = 25;
      await nextTick();
      for (let r = 0; r < generals.length; r += incRender) {
        this.setState({ renderingCount: r });
        await nextTick();
      }
      this.setState({ renderingCount: generals.length });
    }
  }

  private handleOnShowDetail = (general: General): void => {
    this.props.showGeneralDetail(general);
  };

  protected extraPartRender(): JSX.Element {
    const all = this.props.generals.length;
    const count = this.state.renderingCount;
    if (all === count) {
      return <></>;
    }
    return (
      <div className="reading-generals">
        武将読み込み中 {count}/{all}
      </div>
    );
  }

  protected createCardElements(): JSX.Element[] {
    const {
      generals,
      searchedGeneralIds,
      showStrategyExplanation,
    } = this.props;
    const { renderingCount } = this.state;
    const generalCards: JSX.Element[] = [];
    generals.forEach((general, index) => {
      if (renderingCount <= index) {
        return;
      }
      const show = searchedGeneralIds.includes(general.id);
      generalCards.push(
        <GeneralCard
          key={general.id}
          general={general}
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
    const next = this.props.searchedGeneralIds;
    const prev = prevProps.searchedGeneralIds;
    const notChanged =
      next.length === prev.length && next.every((v) => prev.includes(v));
    return !notChanged;
  }
}
