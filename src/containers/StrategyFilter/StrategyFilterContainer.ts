import {
  MapStateToProps,
  MapDispatchToProps,
  MergeProps,
  connect,
} from 'react-redux';
import { bindActionCreators } from 'redux';
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
  Props,
} from './StrategyFilter';

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
  filterCondition: state.datalistReducer.filterCondition.strategies,
  filterContents: state.datalistReducer.filterContents,
});

const mapDispatchToProps: TMapDispatchToProps = (dispatch) => ({
  setCondition: setStrategiesFilterConditionAdapter(dispatch),
  ...bindActionCreators(
    {
      setShowStrategyExplanation: datalistActions.setShowStrategyExplanation,
    },
    dispatch
  ),
});

const mergeProps: TMergeProps = (state, actions) => ({
  ...state,
  ...actions,
  toggleCheckList: (key: StrategiesFilterConditionKey, value: string) => {
    actions.setCondition(
      toggleStrategyCheckList(state.filterCondition, key, value)
    );
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
