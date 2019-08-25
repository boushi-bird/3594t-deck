import './StrategyFilter.css';
import React from 'react';
import {
  FilterContents,
  StrategiesFilterCondition,
  StrategiesFilterConditionKey,
} from '../../modules/datalist';
import SwitchItem from '../../components/SwitchItem';
import SearchTextBox from '../../components/SearchTextBox';
import FilterButtonList from '../../components/FilterButtonList';
import StrategyCategoryButtonList from '../../components/StrategyCategoryButtonList';
import StrategyRangeButtonList from '../../components/StrategyRangeButtonList';
import NumberSelect from '../../components/NumberSelect';

export interface StateFromProps {
  filterCondition: StrategiesFilterCondition;
  filterContents: FilterContents;
}

export interface DispatchFromProps {
  setCondition: (condition: Partial<StrategiesFilterCondition>) => void;
  toggleCheckList: (key: StrategiesFilterConditionKey, value: string) => void;
  setShowStrategyExplanation: (show: boolean) => void;
}

type Props = StateFromProps & DispatchFromProps;

export default class StrategyFilter extends React.PureComponent<Props> {
  private handleOnChangeValue: <V>(
    itemName: StrategiesFilterConditionKey,
    value: V
  ) => void = (itemName, value): void => {
    this.props.setCondition({ [itemName]: value });
  };

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
          <h2 className="title">計略表示切り替え</h2>
          <SwitchItem
            itemName="showStrategyExplanation"
            setCondition={setCondition}
            isOn={filterCondition.showStrategyExplanation}
            labelOff="計略名"
            labelOn="計略説明"
            width={200}
          />
        </section>
        <section className="filter-section">
          <h2 className="title">計略名検索</h2>
          <SearchTextBox
            itemName="strategySearchName"
            value={filterCondition.strategySearchName}
            setCondition={setCondition}
          />
          <div>スペース区切りでAND検索 読み仮名(ひらがな、カタカナ)対応</div>
        </section>
        <section className="filter-section">
          <h2 className="title">計略説明検索</h2>
          <SearchTextBox
            itemName="strategySearchExplanation"
            value={filterCondition.strategySearchExplanation}
            setCondition={setCondition}
          />
          <div>スペース区切りでAND検索</div>
        </section>
        <section className="filter-section">
          <h2 className="title">計略必要士気</h2>
          <div className="range">
            <NumberSelect<StrategiesFilterConditionKey>
              itemName="moraleMin"
              onChangeValue={this.handleOnChangeValue}
              value={filterCondition.moraleMin}
              max={12}
              min={1}
            />
            -
            <NumberSelect<StrategiesFilterConditionKey>
              itemName="moraleMax"
              onChangeValue={this.handleOnChangeValue}
              value={filterCondition.moraleMax}
              max={12}
              min={1}
            />
          </div>
        </section>
        <section className="filter-section">
          <h2 className="title">計略カテゴリー</h2>
          <StrategyCategoryButtonList
            itemName="strategyCategories"
            items={filterContents.strategyCategories}
            checkedItems={filterCondition.strategyCategories}
            onClickItem={toggleCheckList}
          />
        </section>
        <section className="filter-section">
          <h2 className="title">計略効果時間</h2>
          <FilterButtonList
            itemName="strategyTimes"
            items={filterContents.strategyTimes}
            checkedItems={filterCondition.strategyTimes}
            onClickItem={toggleCheckList}
          />
        </section>
        <section className="filter-section">
          <h2 className="title">計略範囲</h2>
          <StrategyRangeButtonList
            itemName="strategyRanges"
            items={filterContents.strategyRanges}
            checkedItems={filterCondition.strategyRanges}
            onClickItem={toggleCheckList}
          />
        </section>
      </div>
    );
  }
}
