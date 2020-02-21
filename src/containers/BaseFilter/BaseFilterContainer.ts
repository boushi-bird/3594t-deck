import {
  MapStateToProps,
  MapDispatchToProps,
  MergeProps,
  connect,
} from 'react-redux';
import { setBasicConditionAdapter } from '../Common/setConditionAdapter';
import { toggleBasicCheckList } from '../Common/toggleCheckList';
import {
  FilterContents,
  BasicFilterCondition,
  BasicFilterConditionKey,
} from '../../modules/datalist';
import { State } from '../../store';
import BaseFilter, {
  StateFromProps,
  DispatchFromProps,
  Props,
} from './BaseFilter';

interface ContainerStateFromProps {
  filterCondition: BasicFilterCondition;
  filterContents: FilterContents;
  deckSearchCondition?: {
    belongState?: string;
    cost: string;
    unitType?: string;
  };
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

const mapStateToProps: TMapStateToProps = state => {
  const { searchCondition } = state.deckReducer;
  return {
    filterCondition: state.datalistReducer.filterCondition.basic,
    filterContents: state.datalistReducer.filterContents,
    deckSearchCondition: searchCondition,
  };
};

const mapDispatchToProps: TMapDispatchToProps = dispatch => ({
  setCondition: setBasicConditionAdapter(dispatch),
});

const mergeProps: TMergeProps = (state, actions) => {
  const { deckSearchCondition, filterCondition, filterContents } = state;
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
    };
  } else {
    sProps = {
      filterContents,
      filterCondition,
      searchByDeckBelongState: false,
      searchByDeckCost: false,
      searchByDeckUnitType: false,
    };
  }
  const dProps: DispatchFromProps = {
    ...actions,
    toggleCheckList: (key: BasicFilterConditionKey, value: string) => {
      actions.setCondition(toggleBasicCheckList(filterCondition, key, value));
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
