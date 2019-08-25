import './RadioButton.css';
import React from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons/faCircle';

interface Props<V> {
  value: V;
  checked: boolean;
  onClick?: (value: V) => void;
  children: React.ReactNode;
}

export default class RadioButton<V> extends React.PureComponent<Props<V>> {
  private handleOnClick = () => {
    if (!this.props.onClick) {
      return;
    }
    this.props.onClick(this.props.value);
  };

  public render(): React.ReactNode {
    const { checked, children } = this.props;
    return (
      <div className="radio-button" onClick={this.handleOnClick}>
        <span className="radio-check">
          <FontAwesomeIcon
            className={classNames({ checked })}
            icon={faCircle}
          />
        </span>
        {children}
      </div>
    );
  }
}
