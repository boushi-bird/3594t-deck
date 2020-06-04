import type {
  MapStateToProps,
  MapDispatchToProps,
  MergeProps,
  Options,
} from 'react-redux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { General, Strategy } from '3594t-deck';
import type { FilterCondition } from '../../modules/datalist';
import { datalistActions } from '../../modules/datalist';
import { windowActions } from '../../modules/window';
import type { State } from '../../store';
import type { StateFromProps, DispatchFromProps, Props } from './CardList';
import CardList from './CardList';
import satisfyStrategy from './satisfyStrategy';
import satisfyGeneral from './satisfyGeneral';

interface ContainerStateFromProps {
  generals: General[];
  strategies: Strategy[];
  currentPage: number;
  pageLimit: number;
  filterCondition: FilterCondition;
  deckSearchCondition?: {
    belongState?: string;
    cost: string;
    unitType?: string;
  };
}

interface ContainerDispatchFromProps {
  decrementPage: () => void;
  incrementPage: () => void;
  openGeneralDetail: (general: General) => void;
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
  generals: state.datalist.generals,
  strategies: state.datalist.strategies,
  currentPage: state.datalist.currentPage,
  pageLimit: state.datalist.pageLimit,
  filterCondition: state.datalist.effectiveFilterCondition,
  deckSearchCondition: state.deck.searchCondition,
});

const mapDispatchToProps: TMapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      decrementPage: datalistActions.decrementPage,
      incrementPage: datalistActions.incrementPage,
      openGeneralDetail: windowActions.openGeneralDetail,
    },
    dispatch
  );
};

const mergeProps: TMergeProps = (state, actions) => {
  const {
    generals,
    strategies,
    currentPage,
    pageLimit,
    filterCondition: rawFilterCondition,
    deckSearchCondition,
  } = state;
  let filterCondition = rawFilterCondition;
  if (deckSearchCondition) {
    filterCondition = {
      ...filterCondition,
      basic: {
        ...filterCondition.basic,
      },
    };
    if (deckSearchCondition.belongState != null) {
      filterCondition.basic.belongStates = [deckSearchCondition.belongState];
    }
    filterCondition.basic.costs = [deckSearchCondition.cost];
    if (deckSearchCondition.unitType != null) {
      filterCondition.basic.unitTypes = [deckSearchCondition.unitType];
    }
  }
  const searchedStrategies = strategies.filter((strategy) => {
    return satisfyStrategy(strategy, filterCondition.strategies);
  });
  let searchedGeneralIds: string[] = [];
  if (searchedStrategies.length > 0) {
    // 計略が総計略数と同じなら計略IDによる絞り込みはしない
    const searchedStrategyIds: string[] | undefined =
      searchedStrategies.length !== strategies.length
        ? searchedStrategies.map((v) => v.id)
        : undefined;
    searchedGeneralIds = generals
      .filter((general) => {
        if (
          searchedStrategyIds &&
          !searchedStrategyIds.includes(general.strategy.id)
        ) {
          return false;
        }
        return satisfyGeneral(general, filterCondition);
      })
      .map((v) => v.id);
  }
  const searchedAll = searchedGeneralIds.length;
  const searchedOffset = (currentPage - 1) * pageLimit;
  const hasPrev = searchedOffset > 0;
  const hasNext = searchedOffset + pageLimit < searchedAll;
  searchedGeneralIds = searchedGeneralIds.slice(
    searchedOffset,
    searchedOffset + pageLimit
  );
  const sProps: StateFromProps = {
    generals,
    count: searchedGeneralIds.length,
    searchedGeneralIds,
    searchedAll,
    searchedOffset,
    searchedLimit: pageLimit,
    hasPrev,
    hasNext,
    show: filterCondition.basic.searchMode === 'general',
    showStrategyExplanation: filterCondition.strategies.showStrategyExplanation,
  };

  const dProps: DispatchFromProps = {
    onPagePrev: actions.decrementPage,
    onPageNext: actions.incrementPage,
    showGeneralDetail: actions.openGeneralDetail,
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
        nextMergedProps.searchedGeneralIds,
        prevMergedProps.searchedGeneralIds
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
)(CardList);
