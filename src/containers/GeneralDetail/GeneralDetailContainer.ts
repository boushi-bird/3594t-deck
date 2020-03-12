import { MapStateToProps, connect } from 'react-redux';
import { State } from '../../store';
import Dialog, { Props } from './GeneralDetail';

type OwnProps = {};

type TMapStateToProps = MapStateToProps<Props, OwnProps, State>;

const mapStateToProps: TMapStateToProps = state => ({
  general: state.windowReducer.detailGeneral,
});

export default connect<Props, {}>(mapStateToProps, {})(Dialog);
