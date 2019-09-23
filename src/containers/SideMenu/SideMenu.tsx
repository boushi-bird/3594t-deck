import './SideMenu.css';
import React from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons/faExternalLinkAlt';

export interface StateFromProps {
  pwaInstallEnabled: boolean;
}

export interface DispatchFromProps {
  installPrompt: () => void;
}

export type Props = StateFromProps & DispatchFromProps;

export default class SideMenu extends React.PureComponent<Props> {
  private handleInstallPrompt = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    if (this.props.pwaInstallEnabled) {
      this.props.installPrompt();
    } else {
      event.stopPropagation();
    }
  };

  public render(): React.ReactNode {
    const { pwaInstallEnabled } = this.props;
    return (
      <ul className="side-menu-list">
        <li className="side-menu-item">
          <a href="./about.html" target="_blank" rel="noopener">
            このツールについて
            <FontAwesomeIcon
              className="external-link-icon"
              icon={faExternalLinkAlt}
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
