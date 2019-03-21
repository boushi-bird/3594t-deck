import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import setConditionAdapter from '../Common/setConditionAdapter';
import toggleCheckList from '../Common/toggleCheckList';
import {
  DatalistState,
  FilterCondition,
  FilterConditionKey,
} from '../../modules/datalist';
import { State } from '../../store';
import SimpleFilter, {
  StateFromProps,
  DispatchFromProps,
} from './SimpleFilter';

interface ContainerDispatchFromProps {
  setCondition: (condition: Partial<FilterCondition>) => void;
}

interface ContainerStateFromProps {
  datalistState: DatalistState;
  deckCardBelongState?: string;
}

export default connect<
  ContainerStateFromProps,
  ContainerDispatchFromProps,
  {},
  StateFromProps & DispatchFromProps
>(
  (state: State) => {
    const { activeIndex, enableSearch, deckCards } = state.deckReducer;
    const deckCard =
      activeIndex != null && enableSearch ? deckCards[activeIndex] : undefined;
    const deckCardBelongState =
      deckCard != null ? deckCard.belongState : undefined;
    return {
      datalistState: state.datalistReducer,
      deckCardBelongState,
    };
  },
  (dispatch: Dispatch) => ({ setCondition: setConditionAdapter(dispatch) }),
  (state, actions) => {
    const { deckCardBelongState, datalistState } = state;
    let searchByDeck = false;
    let filterCondition = datalistState.filterCondition.belongStates;
    if (deckCardBelongState != null) {
      searchByDeck = true;
      filterCondition = [deckCardBelongState];
    }
    return {
      filterCondition,
      filterContents: datalistState.filterContents.belongStates,
      searchByDeck,
      toggleCheckList: (key: FilterConditionKey, value: string) => {
        actions.setCondition(toggleCheckList(datalistState, key, value));
      },
    };
  },
  {
    areStatePropsEqual: (nextStateProps, prevStateProps) => {
      const nextDatalistState = nextStateProps.datalistState;
      const prevDatalistState = prevStateProps.datalistState;
      if (
        nextDatalistState.filterCondition.belongStates !==
        prevDatalistState.filterCondition.belongStates
      ) {
        return false;
      }
      if (
        nextDatalistState.filterContents.belongStates !==
        prevDatalistState.filterContents.belongStates
      ) {
        return false;
      }
      if (
        nextStateProps.deckCardBelongState !==
        prevStateProps.deckCardBelongState
      ) {
        return false;
      }
      return true;
    },
    areMergedPropsEqual: () => false,
  }
)(SimpleFilter);
