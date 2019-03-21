import './SimpleFilter.css';
import React from 'react';
import { FilterConditionKey, FilterItem } from '../../modules/datalist';
import FilterButtonList from '../../components/FilterButtonList';

export interface StateFromProps {
  filterCondition: string[];
  filterContents: FilterItem[];
  searchByDeck: boolean;
}

export interface DispatchFromProps {
  toggleCheckList: (key: FilterConditionKey, value: string) => void;
}

type Props = StateFromProps & DispatchFromProps;

export default class SimpleFilter extends React.Component<Props> {
  public render(): React.ReactNode {
    const {
      filterContents,
      filterCondition,
      searchByDeck,
      toggleCheckList,
    } = this.props;
    return (
      <section className="simple-filter-section">
        <div className="simple-filter-state">
          <h2 className="title-inline">勢力</h2>
          <FilterButtonList
            itemName="belongStates"
            items={filterContents}
            checkedItems={filterCondition}
            onClickItem={toggleCheckList}
            square={true}
            disabled={searchByDeck}
          />
        </div>
      </section>
    );
  }
}
