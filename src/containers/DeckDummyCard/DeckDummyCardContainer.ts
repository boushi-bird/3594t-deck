import { MapStateToProps, MergeProps, connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { General } from '../../interfaces';
import { State } from '../../store';
import { DeckQueryActions } from '../../modules/deck/query';
import DeckDummyCard, {
  StateFromProps,
  DispatchFromProps,
  OwnProps as ComponentOwnProps,
  Props,
} from './DeckDummyCard';

interface ContainerStateFromProps extends StateFromProps {
  generals: General[];
}

type OwnProps = ComponentOwnProps & RouteComponentProps;

type TMapStateToProps = MapStateToProps<
  ContainerStateFromProps,
  OwnProps,
  State
>;
type TMergeProps = MergeProps<ContainerStateFromProps, null, OwnProps, Props>;

const mapStateToProps: TMapStateToProps = state => ({
  generals: state.datalistReducer.generals,
  belongStates: state.datalistReducer.filterContents.belongStates,
  costs: state.datalistReducer.filterContents.costs,
  unitTypes: state.datalistReducer.filterContents.unitTypes,
});

const mergeProps: TMergeProps = (state, _, ownProps) => {
  const { generals, ...otherState } = state;
  const deckQueryAction = new DeckQueryActions(ownProps, generals);
  const sProps: StateFromProps = otherState;
  const dProps: DispatchFromProps = {
    setDeckValue: deckQueryAction.setDeckDummyValue,
  };
  return {
    ...sProps,
    ...dProps,
    ...ownProps,
  };
};

const container = connect<ContainerStateFromProps, null, OwnProps, Props>(
  mapStateToProps,
  null,
  mergeProps
)(DeckDummyCard);

export default withRouter(container);
