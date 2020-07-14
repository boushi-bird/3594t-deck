import type {
  MapStateToProps,
  MapDispatchToProps,
  MergeProps,
} from 'react-redux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { FilterSelectionMode } from '3594t-deck';
import { windowActions } from '../../modules/window';
import { datalistActions } from '../../modules/datalist';
import type { State } from '../../store';
import type { FilterTab } from '../../modules/window';
import type { StateFromProps, DispatchFromProps, Props } from './CardFilter';
import CardFilter from './CardFilter';

interface ContainerStateFromProps {
  activeFilter: FilterTab;
  filterSelectionMode: FilterSelectionMode;
}

type ContainerDispatchFromProps = DispatchFromProps;

interface OwnProps {
  open: boolean;
}

type TMapStateToProps = MapStateToProps<
  ContainerStateFromProps,
  OwnProps,
  State
>;
type TMapDispatchToProps = MapDispatchToProps<
  ContainerDispatchFromProps,
  OwnProps
>;
type TMergeProps = MergeProps<
  ContainerStateFromProps,
  ContainerDispatchFromProps,
  OwnProps,
  Props
>;

const mapStateToProps: TMapStateToProps = (state) => ({
  activeFilter: state.window.activeFilter,
  filterSelectionMode: state.datalist.filterSelectionMode,
});

const mapDispatchToProps: TMapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      close: () => windowActions.changeFilterVisible({ openedFilter: false }),
      resetConditions: datalistActions.resetConditions,
      changeActiveFilterTab: windowActions.changeActiveFilterTab,
      setFilterSelectionMode: datalistActions.setFilterSelectionMode,
    },
    dispatch
  );
};

const mergeProps: TMergeProps = (state, actions, ownProps) => {
  const sProps: StateFromProps = {
    ...state,
    ...ownProps,
  };
  return {
    ...sProps,
    ...actions,
  };
};

export default connect<
  ContainerStateFromProps,
  DispatchFromProps,
  OwnProps,
  Props
>(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(CardFilter);
