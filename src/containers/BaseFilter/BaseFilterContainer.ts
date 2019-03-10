import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { datalistActions } from '../../modules/datalist';
import { State } from '../../store';
import BaseFilter, { StateFromProps, DispatchFromProps } from './BaseFilter';

export default connect<StateFromProps, DispatchFromProps>(
  (state: State) => state.datalistReducer,
  (dispatch: Dispatch) =>
    bindActionCreators(
      {
        setCondition: datalistActions.setCondition,
        toggleCheckList: datalistActions.toggleCheckList,
        toggleCheck: datalistActions.toggleCheck,
      },
      dispatch
    )
)(BaseFilter);
