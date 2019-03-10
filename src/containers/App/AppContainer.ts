import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { windowActions } from '../../modules/window';
import { datalistActions } from '../../modules/datalist';
import { State } from '../../store';
import App, { StateFromProps, DispatchFromProps } from './App';
import { loadFromApi } from '../../services/load-data';

export default connect<StateFromProps, DispatchFromProps>(
  (state: State) => ({
    ...state.windowReducer,
    openedAnyModal: state.windowReducer.openedFilter,
  }),
  (dispatch: Dispatch) => ({
    fetchBaseData: async (): Promise<void> => {
      // TODO APIからかLocalからか選択してデータ取得させる
      const baseData = await loadFromApi();
      dispatch(datalistActions.setBaseData(baseData));
    },
    ...bindActionCreators(
      {
        resetConditions: datalistActions.resetConditions,
        ...windowActions,
      },
      dispatch
    ),
  })
)(App);
