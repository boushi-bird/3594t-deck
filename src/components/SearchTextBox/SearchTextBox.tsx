import './SearchTextBox.css';
import React from 'react';
import classNames from 'classnames';

interface Props<N extends string> {
  value: string;
  className?: string;
  itemName: N;
  onChangeValue: (itemNave: N, value: string) => void;
}

export default class SearchTextBox<
  N extends string = string
> extends React.PureComponent<Props<N>> {
  private handleOnChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = event.currentTarget.value;
    const { itemName, onChangeValue } = this.props;
    onChangeValue(itemName, value);
  };

  public render(): React.ReactNode {
    const { value, className } = this.props;
    return (
      <input
        type="text"
        value={value}
        className={classNames('search-textbox', className)}
        onChange={this.handleOnChange}
      />
    );
  }
}
