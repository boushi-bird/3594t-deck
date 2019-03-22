import './SideMenu.css';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons/faExternalLinkAlt';

export interface StateFromProps {}

export interface DispatchFromProps {}

type Props = StateFromProps & DispatchFromProps;

export default class SideMenu extends React.PureComponent<Props> {
  public render(): React.ReactNode {
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
      </ul>
    );
  }
}
