import './App.css';
import React from 'react';
import classNames from 'classnames';
import { WindowState, filterTabNames, FilterTab } from '../../modules/window';
import FilterTabs from '../../components/FilterTabs';
import FilterActions from '../../components/FilterActions';
import CardList from '../../containers/CardList';
import SimpleFilter from '../../containers/SimpleFilter';
import BaseFilter from '../../containers/BaseFilter';
import DetailFilter from '../../containers/DetailFilter';

export interface StateFromProps extends WindowState {
  openedAnyModal: boolean;
}

export interface DispatchFromProps {
  resetConditions(): void;
  fetchBaseData(): void;
  openFilter(): void;
  closeFilter(): void;
  closeAllModal(): void;
  changeActiveFilterTab(activeFilter: FilterTab): void;
}

type Props = StateFromProps & DispatchFromProps;

export default class App extends React.PureComponent<Props> {
  public componentDidMount(): void {
    this.props.fetchBaseData();
  }

  public render(): React.ReactNode {
    const {
      resetConditions,
      openFilter,
      closeFilter,
      closeAllModal,
      changeActiveFilterTab,
      openedFilter: open,
      openedAnyModal: modal,
      activeFilter,
    } = this.props;
    return (
      <div className={classNames(['app-container', { modal }])}>
        <div className="app-main">
          <div className="card-list-container">
            <div className="simple-filter-container">
              <SimpleFilter />
              <button className="open-filter" onClick={openFilter}>
                絞込
              </button>
            </div>
            <CardList />
          </div>
          <div className={classNames(['card-filter-container', { open }])}>
            <h1 className="card-filter-title">絞り込みメニュー</h1>
            <div className="card-filter-buttons">
              <FilterTabs
                tabs={filterTabNames}
                activeTab={activeFilter}
                onTabChanged={changeActiveFilterTab}
              />
              <FilterActions
                resetConditions={resetConditions}
                closeFilter={closeFilter}
              />
            </div>
            <div
              className={classNames([
                'card-filter-content',
                { active: activeFilter === 'BASIC' },
              ])}
            >
              <BaseFilter />
            </div>
            <div
              className={classNames([
                'card-filter-content',
                { active: activeFilter === 'DETAIL' },
              ])}
            >
              <DetailFilter />
            </div>
          </div>
        </div>
        <div className="modal-background" onClick={closeAllModal} />
      </div>
    );
  }
}
