import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import toggleCheckList from '../Common/toggleCheckList';
import {
  datalistActions,
  DatalistState,
  FilterConditionKey,
} from '../../modules/datalist';
import { State } from '../../store';
import DetailFilter, {
  StateFromProps,
  DispatchFromProps,
} from './DetailFilter';

export default connect<
  DatalistState,
  Pick<DispatchFromProps, Exclude<keyof DispatchFromProps, 'toggleCheckList'>>,
  {},
  StateFromProps & DispatchFromProps
>(
  (state: State) => state.datalistReducer,
  (dispatch: Dispatch) => ({
    ...bindActionCreators(
      {
        setCondition: datalistActions.setCondition,
      },
      dispatch
    ),
  }),
  (state, actions) => ({
    ...state,
    ...actions,
    toggleCheckList: (key: FilterConditionKey, value: string) => {
      actions.setCondition(toggleCheckList(state, key, value));
    },
  })
)(DetailFilter);
