import './RadioButton.css';
import React from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons/faCircle';

interface Props<N extends string, V> {
  itemName: N;
  value: V;
  checked: boolean;
  onClick?: (itemNave: N, value: V) => void;
  children: React.ReactNode;
}

export default class RadioButton<
  N extends string = string,
  V = string
> extends React.PureComponent<Props<N, V>> {
  private handleOnClick = (): void => {
    const { itemName, value, onClick } = this.props;
    if (!onClick) {
      return;
    }
    onClick(itemName, value);
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
