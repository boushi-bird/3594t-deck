import './App.css';
import React from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle';
import SideMenu from '../SideMenu';
import DeckBoard from '../DeckBoard';
import CardList from '../CardList';
import AssistCardList from '../AssistCardList';
import SimpleFilter from '../SimpleFilter';
import CardFilter from '../CardFilter';
import DeckConfig from '../DeckConfig';
import UpdateInfo from '../UpdateInfo';
import AssistDetail from '../AssistDetail';
import GeneralDetail from '../GeneralDetail';
import Dialog from '../Dialog';

export interface StateFromProps {
  ready: boolean;
  openedSideMenu: boolean;
  openedFilter: boolean;
  openedAnyModalSmall: boolean;
  openedAnyModal: boolean;
  showNotice: boolean;
  loading: boolean;
  deckSelected: boolean;
}

export interface DispatchFromProps {
  clearActiveCard(): void;
  appDidLoaded(): void;
  openSideMenu(): void;
  closeSideMenu(): void;
  openFilter(): void;
  closeAllModal(): void;
}

export type OwnProps = {};

export type Props = StateFromProps & DispatchFromProps & OwnProps;

export default class App extends React.PureComponent<Props> {
  public componentDidMount(): void {
    this.props.appDidLoaded();
  }

  private handleAppClick = (): void => {
    this.props.clearActiveCard();
    this.props.closeSideMenu();
  };

  private handleSideMenuButtonClick = (): void => {
    this.props.openSideMenu();
  };

  public render(): React.ReactNode {
    const {
      ready,
      loading,
      openedSideMenu,
      openFilter,
      showNotice,
      closeAllModal,
      openedFilter,
      openedAnyModal: modal,
      openedAnyModalSmall: modalSmall,
      deckSelected,
    } = this.props;
    return (
      <div
        className={classNames([
          'app-container',
          {
            modal,
            'modal-small': modalSmall,
            ready,
            'deck-selected': deckSelected,
          },
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
            <div className="list-container">
              <div className="simple-filter-container">
                <SimpleFilter />
                <button className="open-filter" onClick={openFilter}>
                  絞込
                </button>
              </div>
              <CardList />
              <AssistCardList />
            </div>
          </div>
          <CardFilter open={openedFilter} />
        </div>
        <div className="modal-background" onClick={closeAllModal} />
        <AssistDetail />
        <GeneralDetail />
        <DeckConfig />
        <UpdateInfo />
        <div className={classNames('loading-item', { loading })} />
        <Dialog />
      </div>
    );
  }
}
