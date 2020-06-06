import type {
  MapStateToProps,
  MapDispatchToProps,
  MergeProps,
} from 'react-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import type { State } from '../../store';
import { deckActions } from '../../modules/deck';
import type {
  StateFromProps,
  DispatchFromProps,
  OwnProps,
  Props,
} from './DeckDummyCard';
import DeckDummyCard from './DeckDummyCard';

type ContainerStateFromProps = StateFromProps;

interface ContainerDispatchFromProps {
  setDeckDummyValue: typeof deckActions['setDeckDummyValue'];
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
  generals: state.datalist.generals,
  belongStates: state.datalist.filterContents.belongStates,
  costs: state.datalist.filterContents.costs,
  unitTypes: state.datalist.filterContents.unitTypes,
});

const mapDispatchToProps: TMapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      setDeckDummyValue: deckActions.setDeckDummyValue,
    },
    dispatch
  );
};

const mergeProps: TMergeProps = (state, actions, ownProps) => {
  const sProps: StateFromProps = state;
  const dProps: DispatchFromProps = {
    setDeckValue: actions.setDeckDummyValue,
  };
  return {
    ...sProps,
    ...dProps,
    ...ownProps,
  };
};

export default connect<
  ContainerStateFromProps,
  TMapDispatchToProps,
  OwnProps,
  Props
>(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(DeckDummyCard);
