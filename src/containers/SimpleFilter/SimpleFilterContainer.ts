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

export default connect<
  DatalistState,
  ContainerDispatchFromProps,
  {},
  StateFromProps & DispatchFromProps
>(
  (state: State) => state.datalistReducer,
  (dispatch: Dispatch) => ({ setCondition: setConditionAdapter(dispatch) }),
  (state, actions) => ({
    filterCondition: state.filterCondition.belongStates,
    filterContents: state.filterContents.belongStates,
    toggleCheckList: (key: FilterConditionKey, value: string) => {
      actions.setCondition(toggleCheckList(state, key, value));
    },
  }),
  {
    areStatePropsEqual: (nextStateProps, prevStateProps) => {
      return (
        nextStateProps.filterCondition.belongStates ===
          prevStateProps.filterCondition.belongStates &&
        nextStateProps.filterContents.belongStates ===
          prevStateProps.filterContents.belongStates
      );
    },
    areMergedPropsEqual: () => false,
  }
)(SimpleFilter);
