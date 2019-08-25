import './SwitchItem.css';
import React from 'react';
import classNames from 'classnames';

interface Props<N extends string> {
  isOn: boolean;
  labelOff: string;
  labelOn: string;
  itemName: N;
  onChangeValue: (itemNave: N, value: boolean) => void;
  width?: number;
}

export default class SwitchItem<
  N extends string = string
> extends React.PureComponent<Props<N>> {
  private handleOnChange = (): void => {
    const { isOn, itemName, onChangeValue } = this.props;
    onChangeValue(itemName, !isOn);
  };

  public render(): React.ReactNode {
    const { isOn, labelOff, labelOn, width } = this.props;
    const style: React.CSSProperties = {};
    if (width != null) {
      style.width = width;
    }
    classNames('switch-button', { active: isOn });
    return (
      <div style={style} className="switch-item" onClick={this.handleOnChange}>
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
