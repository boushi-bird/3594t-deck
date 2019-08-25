import './DetailFilter.css';
import React from 'react';
import classNames from 'classnames';
import {
  FilterContents,
  DetailFilterCondition,
  DetailFilterConditionKey,
  FilterItem,
} from '../../modules/datalist';
import FilterButtonList from '../../components/FilterButtonList';
import SwitchItem from '../../components/SwitchItem';

export interface StateFromProps {
  filterCondition: DetailFilterCondition;
  filterContents: FilterContents;
}

export interface DispatchFromProps {
  setCondition: (condition: Partial<DetailFilterCondition>) => void;
  toggleCheckList: (key: DetailFilterConditionKey, value: string) => void;
}

type Props = StateFromProps & DispatchFromProps;

const pockets: FilterItem[] = [
  {
    id: '1',
    name: 'あり',
  },
  {
    id: '0',
    name: 'なし',
  },
];

export default class DetailFilter extends React.PureComponent<Props> {
  private handleOnChangeValue: <V>(
    itemName: DetailFilterConditionKey,
    value: V
  ) => void = (itemName, value): void => {
    this.props.setCondition({ [itemName]: value });
  };

  public render(): React.ReactNode {
    const { filterContents, filterCondition, toggleCheckList } = this.props;
    const versionElements: JSX.Element[] = [];
    filterContents.versions.forEach((version, i) => {
      versionElements.push(
        <FilterButtonList<DetailFilterConditionKey>
          key={i + 1}
          itemName="versions"
          items={version}
          checkedItems={filterCondition.versions}
          onClickItem={toggleCheckList}
        />
      );
    });
    return (
      <div>
        <section className="filter-section">
          <h2 className="title">登場弾</h2>
          <div className="title-button">
            <SwitchItem<DetailFilterConditionKey>
              itemName="enableDetailVersion"
              onChangeValue={this.handleOnChangeValue}
              isOn={filterCondition.enableDetailVersion}
              labelOff="メジャーVer"
              labelOn="詳細Ver"
              width={220}
            />
          </div>
          <div
            className={classNames('major-version', {
              active: !filterCondition.enableDetailVersion,
            })}
          >
            <FilterButtonList<DetailFilterConditionKey>
              itemName="majorVersions"
              items={filterContents.majorVersions}
              checkedItems={filterCondition.majorVersions}
              onClickItem={toggleCheckList}
            />
          </div>
          <div
            className={classNames('detail-version', {
              active: filterCondition.enableDetailVersion,
            })}
          >
            {versionElements}
          </div>
        </section>
        <section className="filter-section">
          <h2 className="title">将器主効果候補</h2>
          <div className="title-button">
            <SwitchItem<DetailFilterConditionKey>
              itemName="genMainsAnd"
              onChangeValue={this.handleOnChangeValue}
              isOn={filterCondition.genMainsAnd}
              labelOff="OR"
              labelOn="AND"
            />
          </div>
          <FilterButtonList<DetailFilterConditionKey>
            itemName="genMains"
            items={filterContents.genMains}
            checkedItems={filterCondition.genMains}
            onClickItem={toggleCheckList}
          />
        </section>
        <section className="filter-section">
          <h2 className="title">レアリティ</h2>
          <FilterButtonList<DetailFilterConditionKey>
            itemName="rarities"
            items={filterContents.rarities}
            checkedItems={filterCondition.rarities}
            onClickItem={toggleCheckList}
            square={true}
          />
        </section>
        <section className="filter-section">
          <h2 className="title">官職</h2>
          <FilterButtonList<DetailFilterConditionKey>
            itemName="generalTypes"
            items={filterContents.generalTypes}
            checkedItems={filterCondition.generalTypes}
            onClickItem={toggleCheckList}
          />
        </section>
        <section className="filter-section">
          <h2 className="title">カード種別</h2>
          <FilterButtonList<DetailFilterConditionKey>
            itemName="varTypes"
            items={filterContents.varTypes}
            checkedItems={filterCondition.varTypes}
            onClickItem={toggleCheckList}
          />
        </section>
        <section className="filter-section">
          <h2 className="title">ぽけっと武将</h2>
          <FilterButtonList<DetailFilterConditionKey>
            itemName="pockets"
            items={pockets}
            checkedItems={filterCondition.pockets}
            onClickItem={toggleCheckList}
          />
        </section>
      </div>
    );
  }
}
