import './App.css';
import React from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { WindowState, filterTabNames, FilterTab } from '../../modules/window';
import FilterTabs from '../../components/FilterTabs';
import FilterActions from '../../components/FilterActions';
import SideMenu from '../SideMenu';
import DeckBoard from '../DeckBoard';
import CardList from '../CardList';
import SimpleFilter from '../SimpleFilter';
import BaseFilter from '../BaseFilter';
import DetailFilter from '../DetailFilter';
import Dialog from '../Dialog';

export interface StateFromProps extends WindowState {
  openedAnyModal: boolean;
  loading: boolean;
}

export interface DispatchFromProps {
  clearActiveCard(): void;
  resetConditions(): void;
  fetchBaseData(): void;
  openSideMenu(): void;
  closeSideMenu(): void;
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

  private handleAppClick = () => {
    this.props.clearActiveCard();
    this.props.closeSideMenu();
  };

  private handleSideMenuButtonClick = () => {
    this.props.openSideMenu();
  };

  public render(): React.ReactNode {
    const {
      ready,
      loading,
      resetConditions,
      openedSideMenu,
      openFilter,
      closeFilter,
      closeAllModal,
      changeActiveFilterTab,
      openedFilter: open,
      openedAnyModal: modal,
      activeFilter,
    } = this.props;
    return (
      <div
        className={classNames(['app-container', { modal, ready }])}
        onClick={this.handleAppClick}
      >
        <div className={classNames('side-menu', { open: openedSideMenu })}>
          <div className="side-menu-header" />
          <SideMenu />
          &copy;SEGA
        </div>
        <div className="app-main">
          <div className="app-deck-block">
            <div className="app-header">
              <button
                className={classNames('side-menu-button', {
                  show: !openedSideMenu,
                })}
                onClick={this.handleSideMenuButtonClick}
              >
                <FontAwesomeIcon icon={faBars} />
              </button>
              <div className="app-header-title">
                三国志大戦デッキシミュレーター
              </div>
            </div>
            <div className="deck-boad-container">
              <DeckBoard />
            </div>
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
        <div className={classNames('loading-item', { loading })} />
        <Dialog />
      </div>
    );
  }
}
