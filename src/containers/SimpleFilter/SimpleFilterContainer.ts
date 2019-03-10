import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { datalistActions } from '../../modules/datalist';
import { State } from '../../store';
import SimpleFilter, {
  StateFromProps,
  DispatchFromProps,
} from './SimpleFilter';

export default connect<StateFromProps, DispatchFromProps>(
  (state: State) => ({
    filterCondition: state.datalistReducer.filterCondition.belongStates,
    filterContents: state.datalistReducer.filterContents.belongStates,
  }),
  (dispatch: Dispatch) =>
    bindActionCreators(
      {
        toggleCheckList: datalistActions.toggleCheckList,
      },
      dispatch
    )
)(SimpleFilter);
