import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { setBasicConditionAdapter } from '../Common/setConditionAdapter';
import { toggleBasicCheckList } from '../Common/toggleCheckList';
import {
  FilterContents,
  BasicFilterCondition,
  BasicFilterConditionKey,
} from '../../modules/datalist';
import { State } from '../../store';
import BaseFilter, { StateFromProps, DispatchFromProps } from './BaseFilter';

interface ContainerStateFromProps {
  filterCondition: BasicFilterCondition;
  filterContents: FilterContents;
  deckSearchCondition?: {
    belongState?: string;
    cost: string;
    unitType?: string;
  };
}

export default connect<
  ContainerStateFromProps,
  Omit<DispatchFromProps, 'toggleCheckList'>,
  {},
  StateFromProps & DispatchFromProps
>(
  (state: State) => {
    const { searchCondition } = state.deckReducer;
    return {
      filterCondition: state.datalistReducer.filterCondition.basic,
      filterContents: state.datalistReducer.filterContents,
      deckSearchCondition: searchCondition,
    };
  },
  (dispatch: Dispatch) => ({
    setCondition: setBasicConditionAdapter(dispatch),
  }),
  (state, actions) => {
    const { deckSearchCondition, filterCondition, filterContents } = state;
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
      return {
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
        ...actions,
        toggleCheckList: (key: BasicFilterConditionKey, value: string) => {
          actions.setCondition(
            toggleBasicCheckList(filterCondition, key, value)
          );
        },
      };
    }
    return {
      filterContents,
      filterCondition,
      searchByDeckBelongState: false,
      searchByDeckCost: false,
      searchByDeckUnitType: false,
      ...actions,
      toggleCheckList: (key: BasicFilterConditionKey, value: string) => {
        actions.setCondition(toggleBasicCheckList(filterCondition, key, value));
      },
    };
  },
  { areMergedPropsEqual: () => false }
)(BaseFilter);
