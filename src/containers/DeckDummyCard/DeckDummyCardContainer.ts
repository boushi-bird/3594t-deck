import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { General } from '../../interfaces';
import { State } from '../../store';
import { DeckQueryActions } from '../../modules/deck/query';
import DeckDummyCard, {
  StateFromProps,
  DispatchFromProps,
  OwnProps,
} from './DeckDummyCard';

interface ContainerStateFromProps extends StateFromProps {
  generals: General[];
}

const container = connect<
  ContainerStateFromProps,
  {},
  RouteComponentProps & OwnProps,
  StateFromProps & DispatchFromProps & OwnProps
>(
  (state: State) => ({
    generals: state.datalistReducer.generals,
    belongStates: state.datalistReducer.filterContents.belongStates,
    costs: state.datalistReducer.filterContents.costs,
    unitTypes: state.datalistReducer.filterContents.unitTypes,
  }),
  () => ({}),
  (state, _, ownProps) => {
    const { generals, ...otherState } = state;
    const deckQueryAction = new DeckQueryActions(ownProps, generals);
    return {
      setDeckValue: deckQueryAction.setDeckDummyValue,
      ...otherState,
      ...ownProps,
    };
  }
)(DeckDummyCard);

export default withRouter(container);
