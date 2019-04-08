import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Omit } from 'type-fest';
import { setBasicConditionAdapter } from '../Common/setConditionAdapter';
import { toggleBasicCheckList } from '../Common/toggleCheckList';
import {
  FilterContents,
  BasicFilterCondition,
  BasicFilterConditionKey,
} from '../../modules/datalist';
import { DeckCard } from '../../modules/deck';
import { State } from '../../store';
import BaseFilter, { StateFromProps, DispatchFromProps } from './BaseFilter';

interface ContainerStateFromProps {
  filterCondition: BasicFilterCondition;
  filterContents: FilterContents;
  deckCard?: DeckCard;
}

export default connect<
  ContainerStateFromProps,
  Omit<DispatchFromProps, 'toggleCheckList'>,
  {},
  StateFromProps & DispatchFromProps
>(
  (state: State) => {
    const { activeIndex, enableSearch, deckCards } = state.deckReducer;
    const deckCard =
      activeIndex != null && enableSearch ? deckCards[activeIndex] : undefined;
    return {
      filterCondition: state.datalistReducer.filterCondition.basic,
      filterContents: state.datalistReducer.filterContents,
      deckCard,
    };
  },
  (dispatch: Dispatch) => ({
    setCondition: setBasicConditionAdapter(dispatch),
  }),
  (state, actions) => {
    const { deckCard, filterCondition, filterContents } = state;
    if (deckCard) {
      let belongStates: string[];
      let searchByDeckBelongState = false;
      if (deckCard.belongState != null) {
        belongStates = [deckCard.belongState];
        searchByDeckBelongState = true;
      } else {
        belongStates = filterCondition.belongStates;
      }
      const costs = [deckCard.cost];
      let unitTypes: string[];
      let searchByDeckUnitType = false;
      if (deckCard.unitType != null) {
        unitTypes = [deckCard.unitType];
        searchByDeckUnitType = true;
      } else {
        unitTypes = filterCondition.unitTypes;
      }
      return {
        filterContents,
        searchByDeckBelongState,
        searchByDeckCost: true,
        searchByDeckUnitType,
        filterCondition: {
          ...filterCondition,
          belongStates,
          costs,
          unitTypes,
        },
        ...actions,
        toggleCheckList: (key: BasicFilterConditionKey, value: string) => {
          actions.setCondition(
            toggleBasicCheckList(filterCondition, key, value)
          );
        },
      };
    }
    return {
      filterContents,
      filterCondition,
      searchByDeckBelongState: false,
      searchByDeckCost: false,
      searchByDeckUnitType: false,
      ...actions,
      toggleCheckList: (key: BasicFilterConditionKey, value: string) => {
        actions.setCondition(toggleBasicCheckList(filterCondition, key, value));
      },
    };
  },
  { areMergedPropsEqual: () => false }
)(BaseFilter);
