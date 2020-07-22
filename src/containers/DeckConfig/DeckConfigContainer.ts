import type { MapStateToProps, MapDispatchToProps } from 'react-redux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { deckActions } from '../../modules/deck';
import { windowActions } from '../../modules/window';
import type { State } from '../../store';
import type { StateFromProps, DispatchFromProps } from './DeckConfig';
import DeckConfig from './DeckConfig';

type OwnProps = {};

type TMapStateToProps = MapStateToProps<StateFromProps, OwnProps, State>;
type TMapDispatchToProps = MapDispatchToProps<DispatchFromProps, OwnProps>;

const mapStateToProps: TMapStateToProps = (state) => ({
  show: state.window.openedDeckConfig,
  ...state.deck.deckConstraints,
});

const mapDispatchToProps: TMapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      closeDeckConfig: () =>
        windowActions.changeDeckConfigVisible({
          openedDeckConfig: false,
        }),
      resetDeckConfig: deckActions.resetDeckConstraints,
      setDeckConstraints: deckActions.setDeckConstraints,
      sliceDeckAssist: deckActions.sliceDeckAssist,
    },
    dispatch
  );

export default connect<StateFromProps, DispatchFromProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(DeckConfig);
