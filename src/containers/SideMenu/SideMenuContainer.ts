import { connect } from 'react-redux';
import SideMenu, { StateFromProps, DispatchFromProps } from './SideMenu';

export default connect<StateFromProps, DispatchFromProps>(
  () => ({}),
  () => ({})
)(SideMenu);
