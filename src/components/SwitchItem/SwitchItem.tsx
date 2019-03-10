import './SwitchItem.css';
import React from 'react';
import classNames from 'classnames';
import { FilterCondition } from '../../modules/datalist';

type FilterConditionKey = keyof FilterCondition;

interface Props {
  isOn: boolean;
  labelOff: string;
  labelOn: string;
  itemName: FilterConditionKey;
  setCondition: (condition: Partial<FilterCondition>) => void;
  width?: number;
}

export default class SwitchItem extends React.PureComponent<Props> {
  private handleClickItem = (): void => {
    const { isOn, itemName, setCondition } = this.props;
    setCondition({ [itemName]: !isOn });
  };

  public render(): React.ReactNode {
    const { isOn, labelOff, labelOn, width } = this.props;
    const style: React.CSSProperties = {};
    if (width != null) {
      style.width = width;
    }
    classNames('switch-button', { active: isOn });
    return (
      <div style={style} className="switch-item" onClick={this.handleClickItem}>
        <div className={classNames('switch-button', { active: !isOn })}>
          <button className="switch-button-child">{labelOff}</button>
        </div>
        <div className={classNames('switch-button', { active: isOn })}>
          <button className="switch-button-child">{labelOn}</button>
        </div>
      </div>
    );
  }
}
