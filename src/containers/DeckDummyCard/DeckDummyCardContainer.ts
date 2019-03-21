import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { deckActions } from '../../modules/deck';
import { State } from '../../store';
import DeckDummyCard, {
  OwnProps,
  StateFromProps,
  DispatchFromProps,
} from './DeckDummyCard';

interface ContainerStateFromProps extends StateFromProps {
  activeIndex?: number;
  enableSearch: boolean;
}

interface ContainerDispatchFromProps
  extends Pick<
    DispatchFromProps,
    Exclude<keyof DispatchFromProps, 'toggleSearch'>
  > {
  searchByDeck: (index: number) => void;
}

export default connect<
  ContainerStateFromProps,
  ContainerDispatchFromProps,
  OwnProps,
  StateFromProps & OwnProps & DispatchFromProps
>(
  (state: State) => ({
    belongStates: state.datalistReducer.filterContents.belongStates,
    costs: state.datalistReducer.filterContents.costs,
    unitTypes: state.datalistReducer.filterContents.unitTypes,
    activeIndex: state.deckReducer.activeIndex,
    enableSearch: state.deckReducer.enableSearch,
  }),
  (dispatch: Dispatch) =>
    bindActionCreators(
      {
        setActiveCard: deckActions.setActiveCard,
        setDeckValue: deckActions.setDeckValue,
        removeDeck: deckActions.removeDeck,
        searchByDeck: deckActions.searchByDeck,
      },
      dispatch
    ),
  (state, actions, ownProps) => {
    const { activeIndex, enableSearch, ...otherState } = state;
    const { searchByDeck, ...otherActions } = actions;
    return {
      ...otherState,
      ...ownProps,
      ...otherActions,
      toggleSearch: index => {
        if (activeIndex === index && enableSearch) {
          otherActions.setActiveCard(index);
        } else {
          searchByDeck(index);
        }
      },
    };
  },
  {
    areMergedPropsEqual: () => false,
  }
)(DeckDummyCard);
