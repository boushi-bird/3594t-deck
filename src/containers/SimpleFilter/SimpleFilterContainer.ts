import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import setConditionAdapter from '../Common/setConditionAdapter';
import toggleCheckList from '../Common/toggleCheckList';
import { DatalistState, FilterConditionKey } from '../../modules/datalist';
import { State } from '../../store';
import SimpleFilter, {
  StateFromProps,
  DispatchFromProps,
} from './SimpleFilter';

export default connect<
  DatalistState,
  { dispatch: Dispatch },
  {},
  StateFromProps & DispatchFromProps
>(
  (state: State) => state.datalistReducer,
  (dispatch: Dispatch) => ({ dispatch }),
  (state, { dispatch }) => ({
    filterCondition: state.filterCondition.belongStates,
    filterContents: state.filterContents.belongStates,
    toggleCheckList: (key: FilterConditionKey, value: string) => {
      setConditionAdapter(dispatch)(toggleCheckList(state, key, value));
    },
  })
)(SimpleFilter);
