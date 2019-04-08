import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Omit } from 'type-fest';
import { setDetailConditionAdapter } from '../Common/setConditionAdapter';
import { toggleDetailCheckList } from '../Common/toggleCheckList';
import { DetailFilterConditionKey } from '../../modules/datalist';
import { State } from '../../store';
import DetailFilter, {
  StateFromProps,
  DispatchFromProps,
} from './DetailFilter';

export default connect<
  StateFromProps,
  Omit<DispatchFromProps, 'toggleCheckList'>,
  {},
  StateFromProps & DispatchFromProps
>(
  (state: State) => ({
    filterCondition: state.datalistReducer.filterCondition.detail,
    filterContents: state.datalistReducer.filterContents,
  }),
  (dispatch: Dispatch) => ({
    setCondition: setDetailConditionAdapter(dispatch),
  }),
  (state, actions) => ({
    ...state,
    ...actions,
    toggleCheckList: (key: DetailFilterConditionKey, value: string) => {
      actions.setCondition(toggleDetailCheckList(state, key, value));
    },
  }),
  { areMergedPropsEqual: () => false }
)(DetailFilter);
