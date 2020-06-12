import type {
  MapStateToProps,
  MapDispatchToProps,
  MergeProps,
} from 'react-redux';
import { connect } from 'react-redux';
import type { FilterItem, SearchMode } from '3594t-deck';
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
import type { StateFromProps, DispatchFromProps, Props } from './SimpleFilter';
import SimpleFilter from './SimpleFilter';

interface ContainerStateFromProps {
  belongStates: FilterItem[];
  searchMode: SearchMode;
  basicFilterCondition: BasicFilterCondition;
  deckCardBelongState?: string;
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
  const deckCardBelongState = searchCondition
    ? searchCondition.belongState
    : undefined;
  return {
    belongStates: state.datalist.filterContents.belongStates,
    searchMode: getSearchMode(state.deck, state.datalist.filterCondition),
    basicFilterCondition: state.datalist.filterCondition.basic,
    deckCardBelongState,
  };
};

const mapDispatchToProps: TMapDispatchToProps = (dispatch) => ({
  setSearchMode: setSearchModeAdapter(dispatch),
  setCondition: setBasicConditionAdapter(dispatch),
});

const mergeProps: TMergeProps = (state, actions) => {
  const {
    deckCardBelongState,
    belongStates,
    searchMode,
    basicFilterCondition,
  } = state;
  let searchByDeck = false;
  let filterCondition = basicFilterCondition.belongStates;
  if (deckCardBelongState != null) {
    searchByDeck = true;
    filterCondition = [deckCardBelongState];
  }
  const sProps: StateFromProps = {
    filterContents: belongStates,
    filterCondition,
    searchByDeck,
    searchMode,
  };
  const dProps: DispatchFromProps = {
    setCondition: actions.setCondition,
    setSearchMode: actions.setSearchMode,
    toggleCheckList: (key: BasicFilterConditionKey, value: string) => {
      actions.setCondition(
        toggleBasicCheckList(basicFilterCondition, key, value)
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
})(SimpleFilter);
