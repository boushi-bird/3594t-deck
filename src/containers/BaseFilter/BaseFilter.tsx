import './BaseFilter.css';
import React from 'react';
import classNames from 'classnames';
import {
  FilterContents,
  BasicFilterCondition,
  BasicFilterConditionKey,
} from '../../modules/datalist';
import FilterButtonList from '../../components/FilterButtonList';
import SkillButtonList from '../../components/SkillButtonList';
import SwitchItem from '../../components/SwitchItem';
import NumberSelect from '../../components/NumberSelect';
import CostRatioBaseForce from '../../components/CostRatioBaseForce';

export interface StateFromProps {
  filterCondition: BasicFilterCondition;
  filterContents: FilterContents;
  searchByDeckBelongState: boolean;
  searchByDeckCost: boolean;
  searchByDeckUnitType: boolean;
}

export interface DispatchFromProps {
  setCondition: (condition: Partial<BasicFilterCondition>) => void;
  toggleCheckList: (key: BasicFilterConditionKey, value: string) => void;
}

type Props = StateFromProps & DispatchFromProps;

export default class BaseFilter extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const {
      filterContents,
      filterCondition,
      searchByDeckBelongState,
      searchByDeckCost,
      searchByDeckUnitType,
      setCondition,
      toggleCheckList,
    } = this.props;
    return (
      <div>
        <section className="filter-section">
          <h2 className="title">勢力</h2>
          <FilterButtonList
            itemName="belongStates"
            items={filterContents.belongStates}
            checkedItems={filterCondition.belongStates}
            onClickItem={toggleCheckList}
            square={true}
            disabled={searchByDeckBelongState}
          />
        </section>
        <section className="filter-section">
          <h2 className="title">コスト</h2>
          <FilterButtonList
            itemName="costs"
            items={filterContents.costs}
            checkedItems={filterCondition.costs}
            onClickItem={toggleCheckList}
            square={true}
            disabled={searchByDeckCost}
          />
        </section>
        <section className="filter-section">
          <h2 className="title">兵種</h2>
          <FilterButtonList
            itemName="unitTypes"
            items={filterContents.unitTypes}
            checkedItems={filterCondition.unitTypes}
            onClickItem={toggleCheckList}
            square={true}
            disabled={searchByDeckUnitType}
          />
        </section>
        <section className="filter-section">
          <h2 className="title">武力</h2>
          <div className="title-button">
            <SwitchItem
              itemName="useCostRatioForce"
              setCondition={setCondition}
              isOn={filterCondition.useCostRatioForce}
              labelOff="通常"
              labelOn="コスト比"
              width={180}
            />
          </div>
          <div
            className={classNames('normal-force', {
              active: !filterCondition.useCostRatioForce,
            })}
          >
            <div className="range">
              <NumberSelect
                itemName="forceMin"
                setCondition={setCondition}
                value={filterCondition.forceMin}
                max={10}
                min={1}
              />
              -
              <NumberSelect
                itemName="forceMax"
                setCondition={setCondition}
                value={filterCondition.forceMax}
                max={10}
                min={1}
              />
            </div>
          </div>
          <div
            className={classNames('cost-ratio-force', {
              active: filterCondition.useCostRatioForce,
            })}
          >
            <div className="range">
              <NumberSelect
                itemName="costRatioForceMin"
                setCondition={setCondition}
                value={filterCondition.costRatioForceMin}
                max={5}
                min={-5}
              />
              以上
            </div>
            <CostRatioBaseForce
              costRatioBaseForces={filterCondition.costRatioBaseForces}
              setCondition={setCondition}
            />
          </div>
        </section>
        <section className="filter-section">
          <h2 className="title">知力</h2>
          <div className="range">
            <NumberSelect
              itemName="intelligenceMin"
              setCondition={setCondition}
              value={filterCondition.intelligenceMin}
              max={10}
              min={1}
            />
            -
            <NumberSelect
              itemName="intelligenceMax"
              setCondition={setCondition}
              value={filterCondition.intelligenceMax}
              max={10}
              min={1}
            />
          </div>
        </section>
        <section className="filter-section">
          <h2 className="title">征圧力</h2>
          <div className="range">
            <NumberSelect
              itemName="conquestMin"
              setCondition={setCondition}
              value={filterCondition.conquestMin}
              max={4}
              min={0}
            />
            -
            <NumberSelect
              itemName="conquestMax"
              setCondition={setCondition}
              value={filterCondition.conquestMax}
              max={4}
              min={0}
            />
          </div>
        </section>
        <section className="filter-section">
          <h2 className="title">特技</h2>
          <div className="title-button">
            <SwitchItem
              itemName="skillsAnd"
              setCondition={setCondition}
              isOn={filterCondition.skillsAnd}
              labelOff="OR"
              labelOn="AND"
            />
          </div>
          <SkillButtonList
            itemName="skills"
            items={filterContents.skills}
            checkedItems={filterCondition.skills}
            onClickItem={toggleCheckList}
            square={true}
          />
        </section>
      </div>
    );
  }
}
