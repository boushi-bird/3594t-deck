import './CostRatioBaseForce.css';
import React from 'react';
import NumberSelect from '../NumberSelect';
import {
  BasicFilterCondition,
  BasicFilterConditionKey,
} from '../../modules/datalist';

interface Props {
  costRatioBaseForces: BasicFilterCondition['costRatioBaseForces'];
  setCondition: (condition: Partial<BasicFilterCondition>) => void;
}

export default class CostRatioBaseForce extends React.PureComponent<Props> {
  private handleOnChangeValue = (
    _: BasicFilterConditionKey,
    value: number,
    itemKey?: string
  ): void => {
    if (!itemKey) {
      return;
    }
    const { setCondition, costRatioBaseForces } = this.props;
    setCondition({
      costRatioBaseForces: {
        ...costRatioBaseForces,
        [itemKey]: value,
      },
    });
  };

  public render(): React.ReactNode {
    const { costRatioBaseForces } = this.props;
    return (
      <div className="cost-ratio-base-force">
        <span className="title-inline">基準武力</span>
        <label>
          1.0
          <NumberSelect<BasicFilterConditionKey>
            itemName="costRatioBaseForces"
            itemKey="10"
            onChangeValue={this.handleOnChangeValue}
            value={costRatioBaseForces['10']}
            max={5}
            min={1}
          />
        </label>
        <label>
          1.5
          <NumberSelect
            itemName="costRatioBaseForces"
            itemKey="15"
            onChangeValue={this.handleOnChangeValue}
            value={costRatioBaseForces['15']}
            max={7}
            min={2}
          />
        </label>
        <label>
          2.0
          <NumberSelect
            itemName="costRatioBaseForces"
            itemKey="20"
            onChangeValue={this.handleOnChangeValue}
            value={costRatioBaseForces['20']}
            max={9}
            min={5}
          />
        </label>
        <label>
          2.5
          <NumberSelect
            itemName="costRatioBaseForces"
            itemKey="25"
            onChangeValue={this.handleOnChangeValue}
            value={costRatioBaseForces['25']}
            max={10}
            min={7}
          />
        </label>
        <label>
          3.0
          <NumberSelect
            itemName="costRatioBaseForces"
            itemKey="30"
            onChangeValue={this.handleOnChangeValue}
            value={costRatioBaseForces['30']}
            max={10}
            min={8}
          />
        </label>
      </div>
    );
  }
}
