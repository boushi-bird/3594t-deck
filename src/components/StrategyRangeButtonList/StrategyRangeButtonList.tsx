import './StrategyRangeButtonList.css';
import React from 'react';
import classNames from 'classnames';
import FilterButtonList, { ButtonItem } from '../FilterButtonList';

export default class StrategyRangeButtonList extends FilterButtonList {
  protected createLabel(item: ButtonItem): React.ReactNode | React.ReactNode[] {
    if (item.code == null) {
      return '';
    }
    const src = `https://3594t.net/img/strat_range/${item.code}.png`;
    return <img className="range-image" src={src} />;
  }

  protected createButton(
    value: string,
    label: React.ReactNode | React.ReactNode[],
    style: React.CSSProperties,
    disabled: boolean,
    className: string
  ): JSX.Element {
    return super.createButton(
      value,
      label,
      style,
      disabled,
      classNames(className, 'strategy-range-button')
    );
  }
}
