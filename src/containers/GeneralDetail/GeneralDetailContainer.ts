import {
  MapStateToProps,
  MapDispatchToProps,
  MergeProps,
  connect,
} from 'react-redux';
import { bindActionCreators } from 'redux';
import { General } from '3594t-deck';
import { DeckCardGeneral } from '../../modules/deck/query';
import { State } from '../../store';
import Dialog, {
  StateFromProps,
  DispatchFromProps,
  Props,
} from './GeneralDetail';
import { deckActions } from '../../modules/deck/reducer';

interface ContainerDispatchFromProps {
  clearActiveCard: () => void;
}

type OwnProps = {};

type TMapStateToProps = MapStateToProps<StateFromProps, OwnProps, State>;
type TMapDispatchToProps = MapDispatchToProps<
  ContainerDispatchFromProps,
  OwnProps
>;
type TMergeProps = MergeProps<
  StateFromProps,
  ContainerDispatchFromProps,
  OwnProps,
  Props
>;

const mapStateToProps: TMapStateToProps = state => ({
  general: state.windowReducer.detailGeneral,
});

const mapDispatchToProps: TMapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      clearActiveCard: deckActions.clearActiveCard,
    },
    dispatch
  );

const mergeProps: TMergeProps = (state, actions) => {
  const { general } = state;
  const sProps: StateFromProps = { general };
  const dProps: DispatchFromProps = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addDeckGeneral: (card: DeckCardGeneral) => {
      actions.clearActiveCard();
      // TODO 詳細画面からもデッキ追加
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    enabledAddDeckGeneral: (general: General) => false,
  };
  return {
    ...sProps,
    ...dProps,
  };
};

export default connect<
  StateFromProps,
  ContainerDispatchFromProps,
  OwnProps,
  StateFromProps & DispatchFromProps
>(mapStateToProps, mapDispatchToProps, mergeProps, {
  areMergedPropsEqual: () => false,
})(Dialog);
