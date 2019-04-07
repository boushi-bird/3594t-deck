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
  public render(): React.ReactNode {
    const {
      filterContents,
      filterCondition,
      setCondition,
      toggleCheckList,
    } = this.props;
    const versionElements: JSX.Element[] = [];
    filterContents.versions.forEach((version, i) => {
      versionElements.push(
        <FilterButtonList
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
            <SwitchItem
              itemName="enableDetailVersion"
              setCondition={setCondition}
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
            <FilterButtonList
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
            <SwitchItem
              itemName="genMainsAnd"
              setCondition={setCondition}
              isOn={filterCondition.genMainsAnd}
              labelOff="OR"
              labelOn="AND"
            />
          </div>
          <FilterButtonList
            itemName="genMains"
            items={filterContents.genMains}
            checkedItems={filterCondition.genMains}
            onClickItem={toggleCheckList}
          />
        </section>
        <section className="filter-section">
          <h2 className="title">レアリティ</h2>
          <FilterButtonList
            itemName="rarities"
            items={filterContents.rarities}
            checkedItems={filterCondition.rarities}
            onClickItem={toggleCheckList}
            square={true}
          />
        </section>
        <section className="filter-section">
          <h2 className="title">官職</h2>
          <FilterButtonList
            itemName="generalTypes"
            items={filterContents.generalTypes}
            checkedItems={filterCondition.generalTypes}
            onClickItem={toggleCheckList}
          />
        </section>
        <section className="filter-section">
          <h2 className="title">カード種別</h2>
          <FilterButtonList
            itemName="varTypes"
            items={filterContents.varTypes}
            checkedItems={filterCondition.varTypes}
            onClickItem={toggleCheckList}
          />
        </section>
        <section className="filter-section">
          <h2 className="title">ぽけっと武将</h2>
          <FilterButtonList
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
