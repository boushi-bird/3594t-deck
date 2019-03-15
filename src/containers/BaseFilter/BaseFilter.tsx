import './BaseFilter.css';
import React from 'react';
import {
  DatalistState,
  FilterCondition,
  FilterConditionKey,
} from '../../modules/datalist';
import FilterButtonList from '../../components/FilterButtonList';
import SkillButtonList from '../../components/SkillButtonList';
import SwitchItem from '../../components/SwitchItem';
import NumberSelect from '../../components/NumberSelect';

export interface StateFromProps {
  filterCondition: FilterCondition;
  filterContents: DatalistState['filterContents'];
}

export interface DispatchFromProps {
  setCondition: (condition: Partial<FilterCondition>) => void;
  toggleCheckList: (key: FilterConditionKey, value: string) => void;
}

type Props = StateFromProps & DispatchFromProps;

export default class BaseFilter extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const {
      filterContents,
      filterCondition,
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
          />
        </section>
        <section className="filter-section">
          <h2 className="title">武力</h2>
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
              min={1}
            />
            -
            <NumberSelect
              itemName="conquestMax"
              setCondition={setCondition}
              value={filterCondition.conquestMax}
              max={4}
              min={1}
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
