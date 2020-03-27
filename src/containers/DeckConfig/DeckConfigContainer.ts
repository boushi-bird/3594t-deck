import { MapStateToProps, MapDispatchToProps, connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { deckActions } from '../../modules/deck';
import { windowActions } from '../../modules/window';
import { State } from '../../store';
import DeckConfig, { StateFromProps, DispatchFromProps } from './DeckConfig';

type OwnProps = {};

type TMapStateToProps = MapStateToProps<StateFromProps, OwnProps, State>;
type TMapDispatchToProps = MapDispatchToProps<DispatchFromProps, OwnProps>;

const mapStateToProps: TMapStateToProps = state => ({
  show: state.windowReducer.openedDeckConfig,
  ...state.deckReducer.deckConstraints,
});

const mapDispatchToProps: TMapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      closeDeckConfig: windowActions.closeDeckConfig,
      setDeckConstraints: deckActions.setDeckConstraints,
      sliceDeckAssist: deckActions.sliceDeckAssist,
    },
    dispatch
  );

export default connect<StateFromProps, DispatchFromProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(DeckConfig);
