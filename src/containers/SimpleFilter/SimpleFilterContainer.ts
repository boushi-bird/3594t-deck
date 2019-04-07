import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { setBasicConditionAdapter } from '../Common/setConditionAdapter';
import { toggleBasicCheckList } from '../Common/toggleCheckList';
import {
  FilterItem,
  BasicFilterCondition,
  BasicFilterConditionKey,
} from '../../modules/datalist';
import { State } from '../../store';
import SimpleFilter, {
  StateFromProps,
  DispatchFromProps,
} from './SimpleFilter';

interface ContainerStateFromProps {
  belongStates: FilterItem[];
  basicFilterCondition: BasicFilterCondition;
  deckCardBelongState?: string;
}

interface ContainerDispatchFromProps {
  setCondition: (condition: Partial<BasicFilterCondition>) => void;
}

export default connect<
  ContainerStateFromProps,
  ContainerDispatchFromProps,
  {},
  StateFromProps & DispatchFromProps
>(
  (state: State) => {
    const { activeIndex, enableSearch, deckCards } = state.deckReducer;
    const deckCard =
      activeIndex != null && enableSearch ? deckCards[activeIndex] : undefined;
    const deckCardBelongState =
      deckCard != null ? deckCard.belongState : undefined;
    return {
      belongStates: state.datalistReducer.filterContents.belongStates,
      basicFilterCondition: state.datalistReducer.filterCondition.basic,
      deckCardBelongState,
    };
  },
  (dispatch: Dispatch) => ({
    setCondition: setBasicConditionAdapter(dispatch),
  }),
  (state, actions) => {
    const { deckCardBelongState, belongStates, basicFilterCondition } = state;
    let searchByDeck = false;
    let filterCondition = basicFilterCondition.belongStates;
    if (deckCardBelongState != null) {
      searchByDeck = true;
      filterCondition = [deckCardBelongState];
    }
    return {
      filterContents: belongStates,
      filterCondition,
      searchByDeck,
      toggleCheckList: (key: BasicFilterConditionKey, value: string) => {
        actions.setCondition(
          toggleBasicCheckList(basicFilterCondition, key, value)
        );
      },
    };
  },
  { areMergedPropsEqual: () => false }
)(SimpleFilter);
