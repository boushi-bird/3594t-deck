import type { MapStateToProps } from 'react-redux';
import { connect } from 'react-redux';
import type { State } from '../../store';
import type { Props } from './GeneralDetail';
import Dialog from './GeneralDetail';

type OwnProps = {};

type TMapStateToProps = MapStateToProps<Props, OwnProps, State>;

const mapStateToProps: TMapStateToProps = (state) => ({
  general: state.window.detailGeneral,
});

export default connect<Props, {}>(mapStateToProps, {})(Dialog);
