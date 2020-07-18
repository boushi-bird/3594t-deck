import './CostRatioBaseForce.css';
import React from 'react';
import {
  MIN_FORCE_10,
  MAX_FORCE_10,
  MIN_FORCE_15,
  MAX_FORCE_15,
  MIN_FORCE_20,
  MAX_FORCE_20,
  MIN_FORCE_25,
  MAX_FORCE_25,
  MIN_FORCE_30,
  MAX_FORCE_30,
} from '../../const';
import NumberSelect from '../NumberSelect';
import type { BasicFilterCondition } from '../../modules/datalist';

interface Props {
  costRatioBaseForces: BasicFilterCondition['costRatioBaseForces'];
  exchangeForceIntelligence: boolean;
  setCondition: (condition: Partial<BasicFilterCondition>) => void;
}

export default class CostRatioBaseForce extends React.PureComponent<Props> {
  private handleOnChangeValue = (itemName: string, value: number): void => {
    const { setCondition, costRatioBaseForces } = this.props;
    setCondition({
      costRatioBaseForces: {
        ...costRatioBaseForces,
        [itemName]: value,
      },
    });
  };

  public render(): React.ReactNode {
    const { costRatioBaseForces, exchangeForceIntelligence } = this.props;
    return (
      <div className="cost-ratio-base-force">
        <span className="title-inline">
          基準{exchangeForceIntelligence ? '知力' : '武力'}
        </span>
        <label>
          1.0
          <NumberSelect
            itemName="10"
            onChangeValue={this.handleOnChangeValue}
            value={costRatioBaseForces['10']}
            max={MAX_FORCE_10}
            min={MIN_FORCE_10}
          />
        </label>
        <label>
          1.5
          <NumberSelect
            itemName="15"
            onChangeValue={this.handleOnChangeValue}
            value={costRatioBaseForces['15']}
            max={MAX_FORCE_15}
            min={MIN_FORCE_15}
          />
        </label>
        <label>
          2.0
          <NumberSelect
            itemName="20"
            onChangeValue={this.handleOnChangeValue}
            value={costRatioBaseForces['20']}
            max={MAX_FORCE_20}
            min={MIN_FORCE_20}
          />
        </label>
        <label>
          2.5
          <NumberSelect
            itemName="25"
            onChangeValue={this.handleOnChangeValue}
            value={costRatioBaseForces['25']}
            max={MAX_FORCE_25}
            min={MIN_FORCE_25}
          />
        </label>
        <label>
          3.0
          <NumberSelect
            itemName="30"
            onChangeValue={this.handleOnChangeValue}
            value={costRatioBaseForces['30']}
            max={MAX_FORCE_30}
            min={MIN_FORCE_30}
          />
        </label>
      </div>
    );
  }
}
