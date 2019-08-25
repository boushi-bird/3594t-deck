import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import {
  datalistActions,
  FilterCondition,
  SameCardConstraint,
} from '../../modules/datalist';
import { deckActions, DeckCard, DeckCardGeneral } from '../../modules/deck';
import { General, Strategy } from '../../interfaces';
import { State } from '../../store';
import CardList, { StateFromProps, DispatchFromProps } from './CardList';
import isEnabledAddDeck from '../Common/isEnabledAddDeck';
import satisfyStrategy from './satisfyStrategy';
import satisfyGeneral from './satisfyGeneral';

interface ContainerStateFromProps {
  generals: General[];
  strategies: Strategy[];
  currentPage: number;
  pageLimit: number;
  filterCondition: FilterCondition;
  deckCards: DeckCard[];
  activeIndex?: number;
  enableDeckSearch: boolean;
  sameCard: SameCardConstraint;
}

interface ContainerDispatchFromProps {
  changeDeckGeneral: (index: number, card: DeckCardGeneral) => void;
  addDeckGeneral: (card: DeckCardGeneral) => void;
  decrementPage: () => void;
  incrementPage: () => void;
}

interface PropForMergedPropsEqual {
  deckPersonals: { personal: string; strat: string }[];
  enabledAddDeck: boolean;
  activeIndex?: number;
  sameCard: SameCardConstraint;
}

const arrayEquals = <V>(a: V[], b: V[]): boolean =>
  a.length === b.length && a.every(v => b.includes(v));

const objectArrayEquals = <V>(
  a: V[],
  b: V[],
  eq: (va: V, vb: V) => boolean
): boolean => a.length === b.length && a.every(va => b.some(vb => eq(va, vb)));

export default connect<
  ContainerStateFromProps,
  ContainerDispatchFromProps,
  {},
  StateFromProps & DispatchFromProps & PropForMergedPropsEqual
>(
  (state: State) => ({
    generals: state.datalistReducer.generals,
    strategies: state.datalistReducer.strategies,
    currentPage: state.datalistReducer.currentPage,
    pageLimit: state.datalistReducer.pageLimit,
    filterCondition: state.datalistReducer.effectiveFilterCondition,
    deckCards: state.deckReducer.deckCards,
    activeIndex: state.deckReducer.activeIndex,
    enableDeckSearch: state.deckReducer.enableSearch,
    sameCard: state.datalistReducer.deckConstraints.sameCard,
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
      strategies,
      currentPage,
      pageLimit,
      filterCondition: rawFilterCondition,
      deckCards,
      activeIndex,
      enableDeckSearch,
      sameCard,
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
    // デッキにいる武将(武将名-計略単位)
    const deckPersonals = generals
      .filter(general => {
        return deckGenerals.includes(general.id);
      })
      .map(v => {
        const { personal, strat } = v.raw;
        return { personal, strat };
      });
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
    const searchedStrategies = strategies.filter(strategy => {
      return satisfyStrategy(strategy, filterCondition.strategies);
    });
    let searchedGeneralIds: string[] = [];
    if (searchedStrategies.length > 0) {
      // 計略が総計略数と同じなら計略IDによる絞り込みはしない
      const searchedStrategyIds: string[] | undefined =
        searchedStrategies.length !== strategies.length
          ? searchedStrategies.map(v => v.id)
          : undefined;
      searchedGeneralIds = generals
        .filter(general => {
          if (
            searchedStrategyIds &&
            !searchedStrategyIds.includes(general.strategy.id)
          ) {
            return false;
          }
          return satisfyGeneral(general, filterCondition);
        })
        .map(v => v.id);
    }
    const searchedAll = searchedGeneralIds.length;
    const searchedOffset = (currentPage - 1) * pageLimit;
    const hasPrev = searchedOffset > 0;
    const hasNext = searchedOffset + pageLimit < searchedAll;
    searchedGeneralIds = searchedGeneralIds.slice(
      searchedOffset,
      searchedOffset + pageLimit
    );
    const enabledAddDeck = isEnabledAddDeck(deckCards, activeIndex);
    let enabledAddDeckGeneral: (general: General) => boolean;
    if (!enabledAddDeck) {
      enabledAddDeckGeneral = () => false;
    } else if (sameCard === 'personal-strategy') {
      enabledAddDeckGeneral = general => {
        return (
          enabledAddDeck &&
          !deckPersonals.some(
            r =>
              r.personal === general.raw.personal &&
              r.strat === general.raw.strat
          )
        );
      };
    } else {
      enabledAddDeckGeneral = general => {
        return (
          enabledAddDeck &&
          !deckPersonals.some(r => r.personal === general.raw.personal)
        );
      };
    }
    return {
      activeIndex,
      sameCard,
      generals,
      searchedGeneralIds,
      deckPersonals,
      searchedAll,
      searchedOffset,
      searchedLimit: pageLimit,
      hasPrev,
      hasNext,
      enabledAddDeck,
      showStrategyExplanation:
        filterCondition.strategies.showStrategyExplanation,
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
      enabledAddDeckGeneral,
    };
  },
  {
    areMergedPropsEqual: (nextMergedProps, prevMergedProps) => {
      if (nextMergedProps.activeIndex !== prevMergedProps.activeIndex) {
        return false;
      }
      if (nextMergedProps.sameCard !== prevMergedProps.sameCard) {
        return false;
      }
      if (nextMergedProps.enabledAddDeck !== prevMergedProps.enabledAddDeck) {
        return false;
      }
      if (
        nextMergedProps.showStrategyExplanation !==
        prevMergedProps.showStrategyExplanation
      ) {
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
        !objectArrayEquals(
          nextMergedProps.deckPersonals,
          prevMergedProps.deckPersonals,
          (va, vb) => va.personal === vb.personal && va.strat === vb.strat
        )
      ) {
        return false;
      }
      return true;
    },
  }
)(CardList);
