import './App.css';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle';
import { WindowState, filterTabNames, FilterTab } from '../../modules/window';
import FilterTabs from '../../components/FilterTabs';
import FilterActions from '../../components/FilterActions';
import SideMenu from '../SideMenu';
import DeckBoard from '../DeckBoard';
import CardList from '../CardList';
import SimpleFilter from '../SimpleFilter';
import BaseFilter from '../BaseFilter';
import DetailFilter from '../DetailFilter';
import StrategyFilter from '../StrategyFilter';
import DeckConfig from '../DeckConfig';
import UpdateInfo from '../UpdateInfo';
import Dialog from '../Dialog';

export interface StateFromProps extends WindowState {
  openedAnyModalSmall: boolean;
  openedAnyModal: boolean;
  showNotice: boolean;
  loading: boolean;
}

export interface DispatchFromProps {
  clearActiveCard(): void;
  resetConditions(): void;
  appDidLoaded(): void;
  openSideMenu(): void;
  closeSideMenu(): void;
  openFilter(): void;
  closeFilter(): void;
  closeAllModal(): void;
  changeActiveFilterTab(activeFilter: FilterTab): void;
}

export type OwnProps = RouteComponentProps;

export type Props = StateFromProps & DispatchFromProps & OwnProps;

export default class App extends React.PureComponent<Props> {
  private unregisterHistoryListen?: () => void;
  public componentDidMount(): void {
    this.props.appDidLoaded();
    this.unregisterHistoryListen = this.props.history.listen(() => {
      this.props.clearActiveCard();
    });
  }

  public componentWillUnmount() {
    if (this.unregisterHistoryListen) {
      this.unregisterHistoryListen();
    }
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
      showNotice,
      closeFilter,
      closeAllModal,
      changeActiveFilterTab,
      openedFilter: open,
      openedAnyModal: modal,
      openedAnyModalSmall: modalSmall,
      activeFilter,
    } = this.props;
    return (
      <div
        className={classNames([
          'app-container',
          { modal, 'modal-small': modalSmall, ready },
        ])}
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
                <FontAwesomeIcon
                  icon={faExclamationCircle}
                  className={classNames('notice', {
                    show: showNotice,
                  })}
                />
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
            <div
              className={classNames([
                'card-filter-content',
                { active: activeFilter === 'STRAT' },
              ])}
            >
              <StrategyFilter />
            </div>
          </div>
        </div>
        <div className="modal-background" onClick={closeAllModal} />
        <DeckConfig />
        <UpdateInfo />
        <div className={classNames('loading-item', { loading })} />
        <Dialog />
      </div>
    );
  }
}
