import {
  MapStateToProps,
  MapDispatchToProps,
  MergeProps,
  connect,
} from 'react-redux';
import { State } from '../../store';
import { deckActions } from '../../modules/deck';
import DeckDummyCard, {
  StateFromProps,
  DispatchFromProps,
  OwnProps,
  Props,
} from './DeckDummyCard';
import { bindActionCreators } from 'redux';

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

const mapStateToProps: TMapStateToProps = state => ({
  generals: state.datalistReducer.generals,
  belongStates: state.datalistReducer.filterContents.belongStates,
  costs: state.datalistReducer.filterContents.costs,
  unitTypes: state.datalistReducer.filterContents.unitTypes,
});

const mapDispatchToProps: TMapDispatchToProps = dispatch => {
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
