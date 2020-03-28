import type {
  MapStateToProps,
  MapDispatchToProps,
  MergeProps,
} from 'react-redux';
import { connect } from 'react-redux';
import { setDetailConditionAdapter } from '../Common/setConditionAdapter';
import { toggleDetailCheckList } from '../Common/toggleCheckList';
import type { DetailFilterConditionKey } from '../../modules/datalist';
import type { State } from '../../store';
import type { StateFromProps, DispatchFromProps, Props } from './DetailFilter';
import DetailFilter from './DetailFilter';

type ContainerDispatchFromProps = Omit<DispatchFromProps, 'toggleCheckList'>;

type OwnProps = {};

type TMapStateToProps = MapStateToProps<StateFromProps, OwnProps, State>;
type TMapDispatchToProps = MapDispatchToProps<
  ContainerDispatchFromProps,
  OwnProps
>;
type TMergeProps = MergeProps<
  StateFromProps,
  ContainerDispatchFromProps,
  OwnProps,
  Props
>;

const mapStateToProps: TMapStateToProps = (state) => ({
  searchMode: state.datalistReducer.filterCondition.basic.searchMode,
  filterCondition: state.datalistReducer.filterCondition.detail,
  filterContents: state.datalistReducer.filterContents,
});

const mapDispatchToProps: TMapDispatchToProps = (dispatch) => ({
  setCondition: setDetailConditionAdapter(dispatch),
});

const mergeProps: TMergeProps = (state, actions) => ({
  ...state,
  ...actions,
  toggleCheckList: (key: DetailFilterConditionKey, value: string) => {
    actions.setCondition(toggleDetailCheckList(state, key, value));
  },
});

export default connect<
  StateFromProps,
  ContainerDispatchFromProps,
  OwnProps,
  Props
>(mapStateToProps, mapDispatchToProps, mergeProps, {
  areMergedPropsEqual: () => false,
})(DetailFilter);
