import './NumberSelect.css';
import React from 'react';
import classNames from 'classnames';

interface Props<N extends string> {
  min: number;
  max: number;
  value: number;
  className?: string;
  step?: number;
  defaultValue?: number;
  itemName: N;
  defaultValueLabel?: string;
  displayText?: (value: number, isDefault: boolean) => string;
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
    const {
      min,
      max,
      value,
      className,
      defaultValue,
      defaultValueLabel,
      displayText,
      step = 1,
    } = this.props;
    const minus = min < 0;
    const options: JSX.Element[] = [];
    for (let i = min; i <= max; i += step) {
      const isDefault = defaultValue != null && defaultValue === i;
      const display =
        (displayText ? displayText(i, isDefault) : `${i}`) +
        (isDefault ? defaultValueLabel || '' : '');
      const displaySign = minus && i > 0 ? '+' : '';
      options.push(
        <option key={i} value={i}>
          {displaySign}
          {display}
        </option>
      );
    }
    const classNameList = ['number-select'];
    if (className) {
      classNameList.push(className);
    }
    if (defaultValueLabel) {
      classNameList.push('has-default-label');
    }
    return (
      <select
        value={value}
        className={classNames(classNameList)}
        onChange={this.handleOnChange}
      >
        {options}
      </select>
    );
  }
}
