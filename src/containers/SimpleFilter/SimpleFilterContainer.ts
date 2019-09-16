import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { setBasicConditionAdapter } from '../Common/setConditionAdapter';
import { toggleBasicCheckList } from '../Common/toggleCheckList';
import {
  FilterItem,
  BasicFilterCondition,
  BasicFilterConditionKey,
} from '../../modules/datalist';
import { State } from '../../store';
import SimpleFilter, {
  StateFromProps,
  DispatchFromProps,
} from './SimpleFilter';

interface ContainerStateFromProps {
  belongStates: FilterItem[];
  basicFilterCondition: BasicFilterCondition;
  deckCardBelongState?: string;
}

interface ContainerDispatchFromProps {
  setCondition: (condition: Partial<BasicFilterCondition>) => void;
}

export default connect<
  ContainerStateFromProps,
  ContainerDispatchFromProps,
  {},
  StateFromProps & DispatchFromProps
>(
  (state: State) => {
    const { searchCondition } = state.deckReducer;
    const deckCardBelongState = searchCondition
      ? searchCondition.belongState
      : undefined;
    return {
      belongStates: state.datalistReducer.filterContents.belongStates,
      basicFilterCondition: state.datalistReducer.filterCondition.basic,
      deckCardBelongState,
    };
  },
  (dispatch: Dispatch) => ({
    setCondition: setBasicConditionAdapter(dispatch),
  }),
  (state, actions) => {
    const { deckCardBelongState, belongStates, basicFilterCondition } = state;
    let searchByDeck = false;
    let filterCondition = basicFilterCondition.belongStates;
    if (deckCardBelongState != null) {
      searchByDeck = true;
      filterCondition = [deckCardBelongState];
    }
    return {
      filterContents: belongStates,
      filterCondition,
      searchByDeck,
      toggleCheckList: (key: BasicFilterConditionKey, value: string) => {
        actions.setCondition(
          toggleBasicCheckList(basicFilterCondition, key, value)
        );
      },
    };
  },
  { areMergedPropsEqual: () => false }
)(SimpleFilter);
