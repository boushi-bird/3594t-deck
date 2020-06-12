import type {
  MapStateToProps,
  MapDispatchToProps,
  MergeProps,
  Options,
} from 'react-redux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { AssistGeneral, SearchMode } from '3594t-deck';
import getSearchMode from '../Common/getSearchMode';
import { datalistActions } from '../../modules/datalist';
import { windowActions } from '../../modules/window';
import type { State } from '../../store';
import type {
  StateFromProps,
  DispatchFromProps,
  Props,
} from './AssistCardList';
import AssistCardList from './AssistCardList';

interface ContainerStateFromProps {
  assistGenerals: AssistGeneral[];
  currentPage: number;
  pageLimit: number;
  belongStates: string[];
  enableSearchByDeck: boolean;
  searchMode: SearchMode;
}

interface ContainerDispatchFromProps {
  decrementPage: () => void;
  incrementPage: () => void;
  openAssistGeneralDetail: (general: AssistGeneral) => void;
}

type OwnProps = {};

type TMapStateToProps = MapStateToProps<
  ContainerStateFromProps,
  OwnProps,
  State
>;
type TMapDispatchToProps = MapDispatchToProps<
  ContainerDispatchFromProps,
  OwnProps
>;
type TMergeProps = MergeProps<
  ContainerStateFromProps,
  ContainerDispatchFromProps,
  OwnProps,
  Props
>;
type ConnectorOptions = Options<
  State,
  ContainerStateFromProps,
  OwnProps,
  Props
>;

const mapStateToProps: TMapStateToProps = (state) => ({
  assistGenerals: state.datalist.assistGenerals,
  currentPage: state.datalist.currentPage,
  pageLimit: state.datalist.pageLimit,
  belongStates: state.datalist.effectiveFilterCondition.basic.belongStates,
  enableSearchByDeck: state.deck.searchCondition != null,
  searchMode: getSearchMode(
    state.deck,
    state.datalist.effectiveFilterCondition
  ),
});

const mapDispatchToProps: TMapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      decrementPage: datalistActions.decrementPage,
      incrementPage: datalistActions.incrementPage,
      openAssistGeneralDetail: windowActions.openAssistGeneralDetail,
    },
    dispatch
  );
};

const mergeProps: TMergeProps = (state, actions) => {
  const {
    assistGenerals,
    currentPage,
    pageLimit,
    belongStates,
    enableSearchByDeck,
    searchMode,
  } = state;
  let searchedAssistGeneralIds: string[] = [];
  if (!enableSearchByDeck) {
    searchedAssistGeneralIds = assistGenerals
      .filter((general) => {
        // 勢力
        if (
          belongStates.length > 0 &&
          !belongStates.includes(general.raw.state)
        ) {
          return false;
        }
        return true;
      })
      .map((general) => general.id);
  }
  const searchedAll = searchedAssistGeneralIds.length;
  const searchedOffset = (currentPage - 1) * pageLimit;
  const hasPrev = searchedOffset > 0;
  const hasNext = searchedOffset + pageLimit < searchedAll;
  searchedAssistGeneralIds = searchedAssistGeneralIds.slice(
    searchedOffset,
    searchedOffset + pageLimit
  );
  const sProps: StateFromProps = {
    assistGenerals,
    count: searchedAssistGeneralIds.length,
    searchedAssistGeneralIds,
    searchedAll,
    searchedOffset,
    searchedLimit: pageLimit,
    hasPrev,
    hasNext,
    show: searchMode === 'assist',
    showStrategyExplanation: false, // TODO
  };

  const dProps: DispatchFromProps = {
    onPagePrev: actions.decrementPage,
    onPageNext: actions.incrementPage,
    showGeneralDetail: actions.openAssistGeneralDetail,
  };

  return {
    ...sProps,
    ...dProps,
  };
};

const arrayEquals = <V>(a: V[], b: V[]): boolean =>
  a.length === b.length && a.every((v) => b.includes(v));

const options: ConnectorOptions = {
  areMergedPropsEqual: (nextMergedProps, prevMergedProps) => {
    if (nextMergedProps.show !== prevMergedProps.show) {
      return false;
    }
    if (
      nextMergedProps.showStrategyExplanation !==
      prevMergedProps.showStrategyExplanation
    ) {
      return false;
    }
    if (nextMergedProps.searchedAll !== prevMergedProps.searchedAll) {
      return false;
    }
    if (nextMergedProps.searchedOffset !== prevMergedProps.searchedOffset) {
      return false;
    }
    if (
      !arrayEquals(
        nextMergedProps.searchedAssistGeneralIds,
        prevMergedProps.searchedAssistGeneralIds
      )
    ) {
      return false;
    }
    return true;
  },
};

export default connect<
  ContainerStateFromProps,
  ContainerDispatchFromProps,
  OwnProps,
  Props
>(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
  options
)(AssistCardList);
