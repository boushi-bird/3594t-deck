import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { setStrategiesFilterConditionAdapter } from '../Common/setConditionAdapter';
import { toggleStrategyCheckList } from '../Common/toggleCheckList';
import {
  StrategiesFilterConditionKey,
  datalistActions,
} from '../../modules/datalist';
import { State } from '../../store';
import DetailFilter, {
  StateFromProps,
  DispatchFromProps,
} from './StrategyFilter';

export default connect<
  StateFromProps,
  Omit<DispatchFromProps, 'toggleCheckList'>,
  {},
  StateFromProps & DispatchFromProps
>(
  (state: State) => ({
    filterCondition: state.datalistReducer.filterCondition.strategies,
    filterContents: state.datalistReducer.filterContents,
  }),
  (dispatch: Dispatch) => ({
    setCondition: setStrategiesFilterConditionAdapter(dispatch),
    ...bindActionCreators(
      {
        setShowStrategyExplanation: datalistActions.setShowStrategyExplanation,
      },
      dispatch
    ),
  }),
  (state, actions) => ({
    ...state,
    ...actions,
    toggleCheckList: (key: StrategiesFilterConditionKey, value: string) => {
      actions.setCondition(
        toggleStrategyCheckList(state.filterCondition, key, value)
      );
    },
  }),
  { areMergedPropsEqual: () => false }
)(DetailFilter);
