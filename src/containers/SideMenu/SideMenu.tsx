import './SideMenu.css';
import React from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons/faExternalLinkAlt';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle';

export interface StateFromProps {
  showNotice: boolean;
  pwaInstallEnabled: boolean;
}

export interface DispatchFromProps {
  openUpdateInfo: () => void;
  installPrompt: () => void;
}

export type Props = StateFromProps & DispatchFromProps;

const ABOUT_LINK_URL = process.env.ABOUT_LINK_URL as string;

export default class SideMenu extends React.PureComponent<Props> {
  private handleInstallPrompt = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ): void => {
    if (this.props.pwaInstallEnabled) {
      this.props.installPrompt();
    } else {
      event.stopPropagation();
    }
  };

  private handleOpenUpdateInfo = (): void => {
    this.props.openUpdateInfo();
  };

  public render(): React.ReactNode {
    const { pwaInstallEnabled, showNotice } = this.props;
    return (
      <ul className="side-menu-list">
        <li className="side-menu-item">
          <a href={ABOUT_LINK_URL} target="_blank" rel="noopener noreferrer">
            このツールについて
            <FontAwesomeIcon
              className="external-link-icon"
              icon={faExternalLinkAlt}
            />
          </a>
        </li>
        <li className="side-menu-item">
          <a onClick={this.handleOpenUpdateInfo}>
            更新情報
            <FontAwesomeIcon
              icon={faExclamationCircle}
              className={classNames('notice', {
                show: showNotice,
              })}
            />
          </a>
        </li>
        <li className="side-menu-item pwa-install">
          <a
            onClick={this.handleInstallPrompt}
            className={classNames({
              disabled: !pwaInstallEnabled,
            })}
          >
            インストールする
          </a>
        </li>
      </ul>
    );
  }
}
