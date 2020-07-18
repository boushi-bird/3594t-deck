import type {
  MapStateToProps,
  MapDispatchToProps,
  MergeProps,
} from 'react-redux';
import { connect } from 'react-redux';
import type {
  FilterContents,
  SearchMode,
  FilterSelectionMode,
} from '3594t-deck';
import {
  setSearchModeAdapter,
  setBasicConditionAdapter,
} from '../Common/setConditionAdapter';
import { toggleBasicCheckList } from '../Common/toggleCheckList';
import getSearchMode from '../Common/getSearchMode';
import type {
  BasicFilterCondition,
  BasicFilterConditionKey,
} from '../../modules/datalist';
import type { State } from '../../store';
import type { StateFromProps, DispatchFromProps, Props } from './BaseFilter';
import BaseFilter from './BaseFilter';

interface ContainerStateFromProps {
  searchMode: SearchMode;
  filterSelectionMode: FilterSelectionMode;
  filterCondition: BasicFilterCondition;
  filterContents: FilterContents;
  deckSearchCondition?: {
    belongState?: string;
    cost: string;
    unitType?: string;
  };
  exchangeForceIntelligence: boolean;
}

type ContainerDispatchFromProps = Omit<DispatchFromProps, 'toggleCheckList'>;

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

const mapStateToProps: TMapStateToProps = (state) => {
  const { searchCondition } = state.deck;
  return {
    searchMode: getSearchMode(state.deck, state.datalist.filterCondition),
    filterSelectionMode: state.datalist.filterSelectionMode,
    filterCondition: state.datalist.filterCondition.basic,
    filterContents: state.datalist.filterContents,
    deckSearchCondition: searchCondition,
    exchangeForceIntelligence: state.deck.deckConstraints.exchange,
  };
};

const mapDispatchToProps: TMapDispatchToProps = (dispatch) => ({
  setSearchMode: setSearchModeAdapter(dispatch),
  setCondition: setBasicConditionAdapter(dispatch),
});

const mergeProps: TMergeProps = (state, actions) => {
  const {
    searchMode,
    filterSelectionMode,
    filterCondition,
    filterContents,
    deckSearchCondition,
    exchangeForceIntelligence,
  } = state;
  let sProps: StateFromProps;
  if (deckSearchCondition) {
    let belongStates: string[];
    let searchByDeckBelongState = false;
    if (deckSearchCondition.belongState != null) {
      belongStates = [deckSearchCondition.belongState];
      searchByDeckBelongState = true;
    } else {
      belongStates = filterCondition.belongStates;
    }
    const costs = [deckSearchCondition.cost];
    let unitTypes: string[];
    let searchByDeckUnitType = false;
    if (deckSearchCondition.unitType != null) {
      unitTypes = [deckSearchCondition.unitType];
      searchByDeckUnitType = true;
    } else {
      unitTypes = filterCondition.unitTypes;
    }
    sProps = {
      searchMode,
      filterContents,
      searchByDeckBelongState,
      searchByDeckCost: true,
      searchByDeckUnitType,
      filterCondition: {
        ...filterCondition,
        belongStates,
        costs,
        unitTypes,
      },
      exchangeForceIntelligence,
    };
  } else {
    sProps = {
      searchMode,
      filterContents,
      filterCondition,
      searchByDeckBelongState: false,
      searchByDeckCost: false,
      searchByDeckUnitType: false,
      exchangeForceIntelligence,
    };
  }
  const dProps: DispatchFromProps = {
    ...actions,
    toggleCheckList: (key: BasicFilterConditionKey, value: string) => {
      actions.setCondition(
        toggleBasicCheckList(filterSelectionMode, filterCondition, key, value)
      );
    },
  };
  return {
    ...sProps,
    ...dProps,
  };
};

export default connect<
  ContainerStateFromProps,
  ContainerDispatchFromProps,
  OwnProps,
  Props
>(mapStateToProps, mapDispatchToProps, mergeProps, {
  areMergedPropsEqual: () => false,
})(BaseFilter);
