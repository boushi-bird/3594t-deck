import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { datalistActions, FilterCondition } from '../../modules/datalist';
import { deckActions, DeckCard, DeckCardGeneral } from '../../modules/deck';
import { General } from '../../services/mapBaseData';
import { State } from '../../store';
import CardList, { StateFromProps, DispatchFromProps } from './CardList';
import isEnabledAddDeck from '../Common/isEnabledAddDeck';
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

interface PropForMergedPropsEqual {
  activeIndex?: number;
}

const arrayEquals = <V>(a: V[], b: V[]): boolean =>
  a.length === b.length && a.every(v => b.includes(v));

export default connect<
  ContainerStateFromProps,
  ContainerDispatchFromProps,
  {},
  StateFromProps & DispatchFromProps & PropForMergedPropsEqual
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
        basic: {
          ...filterCondition.basic,
        },
      };
      if (deckCard.belongState != null) {
        filterCondition.basic.belongStates = [deckCard.belongState];
      }
      filterCondition.basic.costs = [deckCard.cost];
      if (deckCard.unitType != null) {
        filterCondition.basic.unitTypes = [deckCard.unitType];
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
    const enabledAddDeck = isEnabledAddDeck(deckCards, activeIndex);
    return {
      activeIndex,
      generals,
      searchedGeneralIds,
      deckPersonals,
      searchedAll,
      searchedOffset,
      searchedLimit: pageLimit,
      hasPrev,
      hasNext,
      enabledAddDeck,
      addDeckGeneral: (card: DeckCardGeneral) => {
        if (!enabledAddDeck) {
          return;
        }
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
      if (nextMergedProps.activeIndex !== prevMergedProps.activeIndex) {
        return false;
      }
      if (nextMergedProps.enabledAddDeck !== prevMergedProps.enabledAddDeck) {
        return false;
      }
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
