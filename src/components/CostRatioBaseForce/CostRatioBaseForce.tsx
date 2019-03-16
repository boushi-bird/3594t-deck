import './CostRatioBaseForce.css';
import React from 'react';
import NumberSelect from '../NumberSelect';
import { FilterCondition } from '../../modules/datalist';

interface Props {
  costRatioBaseForces: FilterCondition['costRatioBaseForces'];
  setCondition: (condition: Partial<FilterCondition>) => void;
}

export default class CostRatioBaseForce extends React.PureComponent<Props> {
  private handleSetCondition = (condition: Partial<FilterCondition>): void => {
    const { setCondition, costRatioBaseForces } = this.props;
    if (condition.costRatioBaseForces) {
      condition.costRatioBaseForces = {
        ...costRatioBaseForces,
        ...condition.costRatioBaseForces,
      };
    }
    setCondition(condition);
  };

  public render(): React.ReactNode {
    const { costRatioBaseForces } = this.props;
    return (
      <div className="cost-ratio-base-force">
        <span className="title-inline">基準武力</span>
        <label>
          1.0
          <NumberSelect
            itemName="costRatioBaseForces"
            itemKey="10"
            setCondition={this.handleSetCondition}
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
            setCondition={this.handleSetCondition}
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
            setCondition={this.handleSetCondition}
            value={costRatioBaseForces['20']}
            max={8}
            min={5}
          />
        </label>
        <label>
          2.5
          <NumberSelect
            itemName="costRatioBaseForces"
            itemKey="25"
            setCondition={this.handleSetCondition}
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
            setCondition={this.handleSetCondition}
            value={costRatioBaseForces['30']}
            max={10}
            min={8}
          />
        </label>
      </div>
    );
  }
}
