import React from 'react';
import { FilterCondition, FilterConditionKey } from '../../modules/datalist';

interface Props {
  min: number;
  max: number;
  value: number;
  className?: string;
  halfStep?: boolean;
  itemName: FilterConditionKey;
  setCondition: (condition: Partial<FilterCondition>) => void;
}

export default class NumberSelect extends React.PureComponent<Props> {
  private handleChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const value = parseFloat(event.currentTarget.value);
    const { itemName, setCondition } = this.props;
    setCondition({ [itemName]: value });
  };

  public render(): React.ReactNode {
    const { min, max, value, className, halfStep = false } = this.props;
    const options: JSX.Element[] = [];
    for (let i = min; i <= max; i += halfStep ? 0.5 : 1) {
      const display = halfStep ? `${i.toFixed(1)}` : `${i}`;
      options.push(
        <option key={i} value={i}>
          {display}
        </option>
      );
    }
    return (
      <select value={value} className={className} onChange={this.handleChange}>
        {options}
      </select>
    );
  }
}
