import './SearchTextBox.css';
import React from 'react';
import classNames from 'classnames';
import {
  AllFilterCondition,
  AllFilterConditionKey,
} from '../../modules/datalist';

interface Props {
  value: string;
  className?: string;
  itemName: AllFilterConditionKey;
  setCondition: (condition: Partial<AllFilterCondition>) => void;
}

export default class SearchTextBox extends React.PureComponent<Props> {
  private handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.currentTarget.value;
    const { itemName, setCondition } = this.props;
    setCondition({ [itemName]: value });
  };

  public render(): React.ReactNode {
    const { value, className } = this.props;
    return (
      <input
        type="text"
        value={value}
        className={classNames('search-textbox', className)}
        onChange={this.handleChange}
      />
    );
  }
}
