import './FilterButtonList.css';
import React from 'react';
import classNames from 'classnames';
import { AllFilterConditionKey } from '../../modules/datalist';

export interface ButtonItem {
  id: string;
  name: string;
  code?: string;
  nameShort?: string;
  color?: string;
}

interface Props {
  itemName: AllFilterConditionKey;
  items: ButtonItem[];
  checkedItems: string[];
  onClickItem: (itemName: AllFilterConditionKey, itemValue: string) => void;
  square?: boolean;
  addtionalClasses?: string[];
  show?: boolean;
  disabled?: boolean;
}

const defaultClasses = ['button', 'filter-item'];

export default class FilterButtonList extends React.PureComponent<Props> {
  private buttonClasses: string[];
  private square: boolean;

  public constructor(props: Props) {
    super(props);
    this.buttonClasses = props.addtionalClasses
      ? [...defaultClasses, ...props.addtionalClasses]
      : defaultClasses;
    this.square = this.props.square || false;
  }

  private handleClickItem = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    const value = event.currentTarget.value;
    const { itemName, onClickItem } = this.props;
    onClickItem(itemName, value);
  };

  protected createLabel(item: ButtonItem): React.ReactNode | React.ReactNode[] {
    return item.nameShort || item.name;
  }

  protected createButton(
    value: string,
    label: React.ReactNode | React.ReactNode[],
    style: React.CSSProperties,
    disabled: boolean,
    className: string
  ): JSX.Element {
    return (
      <button
        key={value}
        value={value}
        style={style}
        className={className}
        disabled={disabled}
        onClick={this.handleClickItem}
      >
        {label}
      </button>
    );
  }

  public render(): React.ReactNode {
    const { checkedItems, items, show, disabled: propDisabled } = this.props;
    const square = this.square;
    const buttons: JSX.Element[] = [];
    const disabled = propDisabled != null && propDisabled;
    items.forEach(item => {
      const value = item.id;
      const label = this.createLabel(item);
      const style: React.CSSProperties = {};
      if (item.color) {
        style.backgroundColor = item.color;
      }
      const checked = checkedItems.includes(value);
      buttons.push(
        this.createButton(
          value,
          label,
          style,
          disabled,
          classNames(this.buttonClasses, { checked, square })
        )
      );
    });
    const style: React.CSSProperties = {};
    if (show != null && !show) {
      style.display = 'none';
    }
    return (
      <div className="button-list" style={style}>
        {buttons}
      </div>
    );
  }
}
