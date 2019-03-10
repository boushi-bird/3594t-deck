import './FilterButtonList.css';
import React from 'react';
import classNames from 'classnames';
import { FilterCondition } from '../../modules/datalist';

type FilterConditionKey = keyof FilterCondition;

interface ButtonItem {
  id: string;
  name: string;
  nameShort?: string;
  color?: string;
}

interface Props {
  itemName: FilterConditionKey;
  items: ButtonItem[];
  checkedItems: string[];
  onClickItem: (itemName: FilterConditionKey, itemValue: string) => void;
  square?: boolean;
  addtionalClasses?: string[];
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

  protected createButton(
    value: string,
    label: string,
    style: React.CSSProperties,
    className: string
  ): JSX.Element {
    return (
      <button
        key={value}
        value={value}
        style={style}
        className={className}
        onClick={this.handleClickItem}
      >
        {label}
      </button>
    );
  }

  public render(): React.ReactNode {
    const { checkedItems, items } = this.props;
    const square = this.square;
    const buttons: JSX.Element[] = [];
    items.forEach(item => {
      const value = item.id;
      const label = item.nameShort || item.name;
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
          classNames(this.buttonClasses, { checked, square })
        )
      );
    });
    return <div className="button-list">{buttons}</div>;
  }
}
