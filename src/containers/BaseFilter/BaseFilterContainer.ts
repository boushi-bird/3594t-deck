import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import setConditionAdapter from '../Common/setConditionAdapter';
import toggleCheckList from '../Common/toggleCheckList';
import { DatalistState, FilterConditionKey } from '../../modules/datalist';
import { DeckCard } from '../../modules/deck';
import { State } from '../../store';
import BaseFilter, { StateFromProps, DispatchFromProps } from './BaseFilter';

interface ContainerStateFromProps {
  datalistState: DatalistState;
  deckCard?: DeckCard;
}

export default connect<
  ContainerStateFromProps,
  Pick<DispatchFromProps, Exclude<keyof DispatchFromProps, 'toggleCheckList'>>,
  {},
  StateFromProps & DispatchFromProps
>(
  (state: State) => {
    const { activeIndex, enableSearch, deckCards } = state.deckReducer;
    const deckCard =
      activeIndex != null && enableSearch ? deckCards[activeIndex] : undefined;
    return {
      datalistState: state.datalistReducer,
      deckCard,
    };
  },
  (dispatch: Dispatch) => ({
    setCondition: setConditionAdapter(dispatch),
  }),
  (state, actions) => {
    const { deckCard, datalistState } = state;
    if (deckCard) {
      const { filterCondition } = datalistState;
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
        ...datalistState,
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
        toggleCheckList: (key: FilterConditionKey, value: string) => {
          actions.setCondition(toggleCheckList(datalistState, key, value));
        },
      };
    }
    return {
      ...datalistState,
      searchByDeckBelongState: false,
      searchByDeckCost: false,
      searchByDeckUnitType: false,
      ...actions,
      toggleCheckList: (key: FilterConditionKey, value: string) => {
        actions.setCondition(toggleCheckList(datalistState, key, value));
      },
    };
  },
  {
    areMergedPropsEqual: () => false,
  }
)(BaseFilter);
