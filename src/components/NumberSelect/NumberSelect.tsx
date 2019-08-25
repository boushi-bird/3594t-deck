import './NumberSelect.css';
import React from 'react';
import classNames from 'classnames';

interface Props<N extends string> {
  min: number;
  max: number;
  value: number;
  className?: string;
  step?: number;
  itemName: N;
  displayText?: (value: number) => string;
  onChangeValue: (itemNave: N, value: number) => void;
}

export default class NumberSelect<
  N extends string = string
> extends React.PureComponent<Props<N>> {
  private handleOnChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const value = parseFloat(event.currentTarget.value);
    const { itemName, onChangeValue } = this.props;
    onChangeValue(itemName, value);
  };

  public render(): React.ReactNode {
    const { min, max, value, className, displayText, step = 1 } = this.props;
    const minus = min < 0;
    const options: JSX.Element[] = [];
    for (let i = min; i <= max; i += step) {
      const display = displayText ? displayText(i) : `${i}`;
      const displaySign = minus && i > 0 ? '+' : '';
      options.push(
        <option key={i} value={i}>
          {displaySign}
          {display}
        </option>
      );
    }
    return (
      <select
        value={value}
        className={classNames('number-select', className)}
        onChange={this.handleOnChange}
      >
        {options}
      </select>
    );
  }
}
