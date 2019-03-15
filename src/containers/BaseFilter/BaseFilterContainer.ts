import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import setConditionAdapter from '../Common/setConditionAdapter';
import toggleCheckList from '../Common/toggleCheckList';
import { DatalistState, FilterConditionKey } from '../../modules/datalist';
import { State } from '../../store';
import BaseFilter, { StateFromProps, DispatchFromProps } from './BaseFilter';

export default connect<
  DatalistState,
  Pick<DispatchFromProps, Exclude<keyof DispatchFromProps, 'toggleCheckList'>>,
  {},
  StateFromProps & DispatchFromProps
>(
  (state: State) => state.datalistReducer,
  (dispatch: Dispatch) => ({
    setCondition: setConditionAdapter(dispatch),
  }),
  (state, actions) => ({
    ...state,
    ...actions,
    toggleCheckList: (key: FilterConditionKey, value: string) => {
      actions.setCondition(toggleCheckList(state, key, value));
    },
  })
)(BaseFilter);
