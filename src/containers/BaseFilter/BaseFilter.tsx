import './BaseFilter.css';
import React from 'react';
import { DatalistState, FilterCondition } from '../../modules/datalist';
import FilterButtonList from '../../components/FilterButtonList';
import SkillButtonList from '../../components/SkillButtonList';
import SwitchItem from '../../components/SwitchItem';

export interface StateFromProps {
  filterCondition: FilterCondition;
  filterContents: DatalistState['filterContents'];
}

export interface DispatchFromProps {
  setCondition: (condition: Partial<FilterCondition>) => void;
  toggleCheckList: (key: keyof FilterCondition, value: string) => void;
  toggleCheck: (key: keyof FilterCondition, value: boolean) => void;
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
