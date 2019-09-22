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
import SearchTextBox from '../../components/SearchTextBox';

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

export type Props = StateFromProps & DispatchFromProps;

export default class BaseFilter extends React.PureComponent<Props> {
  private handleOnChangeValue: <V>(
    itemName: BasicFilterConditionKey,
    value: V
  ) => void = (itemName, value): void => {
    this.props.setCondition({ [itemName]: value });
  };

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
          <FilterButtonList<BasicFilterConditionKey>
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
          <FilterButtonList<BasicFilterConditionKey>
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
          <FilterButtonList<BasicFilterConditionKey>
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
            <SwitchItem<BasicFilterConditionKey>
              itemName="useCostRatioForce"
              onChangeValue={this.handleOnChangeValue}
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
              <NumberSelect<BasicFilterConditionKey>
                itemName="forceMin"
                onChangeValue={this.handleOnChangeValue}
                value={filterCondition.forceMin}
                max={10}
                min={1}
              />
              -
              <NumberSelect<BasicFilterConditionKey>
                itemName="forceMax"
                onChangeValue={this.handleOnChangeValue}
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
              <NumberSelect<BasicFilterConditionKey>
                itemName="costRatioForceMin"
                onChangeValue={this.handleOnChangeValue}
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
            <NumberSelect<BasicFilterConditionKey>
              itemName="intelligenceMin"
              onChangeValue={this.handleOnChangeValue}
              value={filterCondition.intelligenceMin}
              max={10}
              min={1}
            />
            -
            <NumberSelect<BasicFilterConditionKey>
              itemName="intelligenceMax"
              onChangeValue={this.handleOnChangeValue}
              value={filterCondition.intelligenceMax}
              max={10}
              min={1}
            />
          </div>
        </section>
        <section className="filter-section">
          <h2 className="title">征圧力</h2>
          <div className="range">
            <NumberSelect<BasicFilterConditionKey>
              itemName="conquestMin"
              onChangeValue={this.handleOnChangeValue}
              value={filterCondition.conquestMin}
              max={4}
              min={0}
            />
            -
            <NumberSelect<BasicFilterConditionKey>
              itemName="conquestMax"
              onChangeValue={this.handleOnChangeValue}
              value={filterCondition.conquestMax}
              max={4}
              min={0}
            />
          </div>
        </section>
        <section className="filter-section">
          <h2 className="title">特技</h2>
          <div className="title-button">
            <SwitchItem<BasicFilterConditionKey>
              itemName="skillsAnd"
              onChangeValue={this.handleOnChangeValue}
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
        <section className="filter-section">
          <h2 className="title">武将名検索</h2>
          <SearchTextBox<BasicFilterConditionKey>
            itemName="searchText"
            value={filterCondition.searchText}
            onChangeValue={this.handleOnChangeValue}
          />
          <div>スペース区切りでOR検索 読み仮名(ひらがな、カタカナ)対応</div>
        </section>
      </div>
    );
  }
}
