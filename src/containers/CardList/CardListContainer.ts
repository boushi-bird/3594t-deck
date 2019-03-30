import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { datalistActions, FilterCondition } from '../../modules/datalist';
import { deckActions, DeckCard, DeckCardGeneral } from '../../modules/deck';
import { General } from '../../services/mapBaseData';
import { State } from '../../store';
import CardList, { StateFromProps, DispatchFromProps } from './CardList';
import satisfyGeneral from './satisfyGeneral';

interface ContainerStateFromProps {
  generals: General[];
  currentPage: number;
  pageLimit: number;
  filterCondition: FilterCondition;
  deckCards: DeckCard[];
  activeIndex?: number;
  enableDeckSearch: boolean;
}

interface ContainerDispatchFromProps {
  changeDeckGeneral: (index: number, card: DeckCardGeneral) => void;
  addDeckGeneral: (card: DeckCardGeneral) => void;
  decrementPage: () => void;
  incrementPage: () => void;
}

const arrayEquals = <V>(a: V[], b: V[]): boolean =>
  a.length === b.length && a.every(v => b.includes(v));

export default connect<
  ContainerStateFromProps,
  ContainerDispatchFromProps,
  {},
  StateFromProps & DispatchFromProps
>(
  (state: State) => ({
    generals: state.datalistReducer.generals,
    currentPage: state.datalistReducer.currentPage,
    pageLimit: state.datalistReducer.pageLimit,
    filterCondition: state.datalistReducer.effectiveFilterCondition,
    deckCards: state.deckReducer.deckCards,
    activeIndex: state.deckReducer.activeIndex,
    enableDeckSearch: state.deckReducer.enableSearch,
  }),
  (dispatch: Dispatch) =>
    bindActionCreators(
      {
        changeDeckGeneral: deckActions.changeDeckGeneral,
        addDeckGeneral: deckActions.addDeckGeneral,
        decrementPage: datalistActions.decrementPage,
        incrementPage: datalistActions.incrementPage,
      },
      dispatch
    ),
  (state, actions) => {
    const {
      generals,
      currentPage,
      pageLimit,
      filterCondition: rawFilterCondition,
      deckCards,
      activeIndex,
      enableDeckSearch,
    } = state;
    const deckGenerals: string[] = [];
    deckCards.forEach((deckCard, i) => {
      if (activeIndex === i) {
        return;
      }
      const general = deckCard.general;
      if (general) {
        deckGenerals.push(general);
      }
    });
    // デッキにいる武将(武将名単位)
    const deckPersonals = generals
      .filter(general => {
        return deckGenerals.includes(general.id);
      })
      .map(v => v.raw.personal);
    const deckCard =
      activeIndex != null && enableDeckSearch
        ? deckCards[activeIndex]
        : undefined;
    let filterCondition = rawFilterCondition;
    if (deckCard) {
      filterCondition = {
        ...filterCondition,
      };
      if (deckCard.belongState != null) {
        filterCondition.belongStates = [deckCard.belongState];
      }
      filterCondition.costs = [deckCard.cost];
      if (deckCard.unitType != null) {
        filterCondition.unitTypes = [deckCard.unitType];
      }
    }
    let searchedGeneralIds = generals
      .filter(general => {
        return satisfyGeneral(general, filterCondition);
      })
      .map(v => v.id);
    const searchedAll = searchedGeneralIds.length;
    const searchedOffset = (currentPage - 1) * pageLimit;
    const hasPrev = searchedOffset > 0;
    const hasNext = searchedOffset + pageLimit < searchedAll;
    searchedGeneralIds = searchedGeneralIds.slice(
      searchedOffset,
      searchedOffset + pageLimit
    );
    return {
      generals,
      searchedGeneralIds,
      deckPersonals,
      searchedAll,
      searchedOffset,
      searchedLimit: pageLimit,
      hasPrev,
      hasNext,
      addDeckGeneral: (card: DeckCardGeneral) => {
        if (activeIndex != null) {
          actions.changeDeckGeneral(activeIndex, card);
        } else {
          actions.addDeckGeneral(card);
        }
      },
      onPagePrev: actions.decrementPage,
      onPageNext: actions.incrementPage,
    };
  },
  {
    areMergedPropsEqual: (nextMergedProps, prevMergedProps) => {
      if (nextMergedProps.searchedAll !== prevMergedProps.searchedAll) {
        return false;
      }
      if (nextMergedProps.searchedOffset !== prevMergedProps.searchedOffset) {
        return false;
      }
      if (
        !arrayEquals(
          nextMergedProps.searchedGeneralIds,
          prevMergedProps.searchedGeneralIds
        )
      ) {
        return false;
      }
      if (
        !arrayEquals(
          nextMergedProps.deckPersonals,
          prevMergedProps.deckPersonals
        )
      ) {
        return false;
      }
      return true;
    },
  }
)(CardList);
