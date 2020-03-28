import type {
  MapStateToProps,
  MapDispatchToProps,
  MergeProps,
} from 'react-redux';
import { connect } from 'react-redux';
import type { FilterItem } from '3594t-deck';
import { setBasicConditionAdapter } from '../Common/setConditionAdapter';
import { toggleBasicCheckList } from '../Common/toggleCheckList';
import type {
  BasicFilterCondition,
  BasicFilterConditionKey,
} from '../../modules/datalist';
import type { State } from '../../store';
import type { StateFromProps, DispatchFromProps, Props } from './SimpleFilter';
import SimpleFilter from './SimpleFilter';

interface ContainerStateFromProps {
  belongStates: FilterItem[];
  basicFilterCondition: BasicFilterCondition;
  deckCardBelongState?: string;
}

interface ContainerDispatchFromProps {
  setCondition: (condition: Partial<BasicFilterCondition>) => void;
}

type OwnProps = {};

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

const mapStateToProps: TMapStateToProps = (state) => {
  const { searchCondition } = state.deckReducer;
  const deckCardBelongState = searchCondition
    ? searchCondition.belongState
    : undefined;
  return {
    belongStates: state.datalistReducer.filterContents.belongStates,
    basicFilterCondition: state.datalistReducer.filterCondition.basic,
    deckCardBelongState,
  };
};

const mapDispatchToProps: TMapDispatchToProps = (dispatch) => ({
  setCondition: setBasicConditionAdapter(dispatch),
});

const mergeProps: TMergeProps = (state, actions) => {
  const { deckCardBelongState, belongStates, basicFilterCondition } = state;
  let searchByDeck = false;
  let filterCondition = basicFilterCondition.belongStates;
  if (deckCardBelongState != null) {
    searchByDeck = true;
    filterCondition = [deckCardBelongState];
  }
  const sProps: StateFromProps = {
    filterContents: belongStates,
    filterCondition,
    searchByDeck,
    searchMode: basicFilterCondition.searchMode,
  };
  const dProps: DispatchFromProps = {
    setCondition: actions.setCondition,
    toggleCheckList: (key: BasicFilterConditionKey, value: string) => {
      actions.setCondition(
        toggleBasicCheckList(basicFilterCondition, key, value)
      );
    },
  };
  return {
    ...sProps,
    ...dProps,
  };
};

export default connect<
  ContainerStateFromProps,
  ContainerDispatchFromProps,
  OwnProps,
  Props
>(mapStateToProps, mapDispatchToProps, mergeProps, {
  areMergedPropsEqual: () => false,
})(SimpleFilter);
