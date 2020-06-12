import type { MapStateToProps, MapDispatchToProps } from 'react-redux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { State } from '../../store';
import { windowActions } from '../../modules/window';
import type { StateFromProps, DispatchFromProps } from './AssistDetail';
import Dialog from './AssistDetail';

type OwnProps = {};

type TMapStateToProps = MapStateToProps<StateFromProps, OwnProps, State>;

type TMapDispatchToProps = MapDispatchToProps<DispatchFromProps, OwnProps>;

const mapStateToProps: TMapStateToProps = (state) => ({
  card: state.window.detailAssistGeneral,
});

const mapDispatchToProps: TMapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      close: windowActions.closeAllModal,
    },
    dispatch
  );
};

export default connect<StateFromProps, DispatchFromProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(Dialog);
