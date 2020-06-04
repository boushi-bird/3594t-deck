import type {
  MapStateToProps,
  MapDispatchToProps,
  MergeProps,
} from 'react-redux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setStrategiesFilterConditionAdapter } from '../Common/setConditionAdapter';
import { toggleStrategyCheckList } from '../Common/toggleCheckList';
import type { StrategiesFilterConditionKey } from '../../modules/datalist';
import { datalistActions } from '../../modules/datalist';
import type { State } from '../../store';
import type {
  StateFromProps,
  DispatchFromProps,
  Props,
} from './StrategyFilter';
import DetailFilter from './StrategyFilter';

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
  searchMode: state.datalist.filterCondition.basic.searchMode,
  filterCondition: state.datalist.filterCondition.strategies,
  filterContents: state.datalist.filterContents,
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
