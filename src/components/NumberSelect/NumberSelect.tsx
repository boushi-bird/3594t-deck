import './NumberSelect.css';
import React from 'react';
import classNames from 'classnames';
import {
  AllFilterCondition,
  AllFilterConditionKey,
} from '../../modules/datalist';

interface Props {
  min: number;
  max: number;
  value: number;
  className?: string;
  halfStep?: boolean;
  itemName: AllFilterConditionKey;
  itemKey?: string;
  setCondition: (condition: Partial<AllFilterCondition>) => void;
}

export default class NumberSelect extends React.PureComponent<Props> {
  private handleChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const value = parseFloat(event.currentTarget.value);
    const { itemName, itemKey, setCondition } = this.props;
    if (itemKey != null) {
      setCondition({ [itemName]: { [itemKey]: value } });
    } else {
      setCondition({ [itemName]: value });
    }
  };

  public render(): React.ReactNode {
    const { min, max, value, className, halfStep = false } = this.props;
    const minus = min < 0;
    const options: JSX.Element[] = [];
    for (let i = min; i <= max; i += halfStep ? 0.5 : 1) {
      const display = halfStep ? `${i.toFixed(1)}` : `${i}`;
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
        onChange={this.handleChange}
      >
        {options}
      </select>
    );
  }
}
