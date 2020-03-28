import { MapStateToProps, MapDispatchToProps, connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { windowActions } from '../../modules/window';
import { State } from '../../store';
import UpdateInfo, { StateFromProps, DispatchFromProps } from './UpdateInfo';

type OwnProps = {};

type TMapStateToProps = MapStateToProps<StateFromProps, OwnProps, State>;
type TMapDispatchToProps = MapDispatchToProps<DispatchFromProps, OwnProps>;

const mapStateToProps: TMapStateToProps = (state) => ({
  show: state.windowReducer.openedUpdateInfo,
});

const mapDispatchToProps: TMapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      closeUpdateInfo: windowActions.closeUpdateInfo,
    },
    dispatch
  );

export default connect<StateFromProps, DispatchFromProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(UpdateInfo);
