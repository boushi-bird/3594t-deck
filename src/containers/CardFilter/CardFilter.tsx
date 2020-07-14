import './CardFilter.css';
import React from 'react';
import classNames from 'classnames';
import type { FilterSelectionMode } from '3594t-deck';
import type { FilterTab } from '../../modules/window';
import { filterTabNames } from '../../modules/window';
import FilterTabs from '../../components/FilterTabs';
import FilterActions from '../../components/FilterActions';
import BaseFilter from '../BaseFilter';
import DetailFilter from '../DetailFilter';
import StrategyFilter from '../StrategyFilter';
import SwitchItem from '../../components/SwitchItem';

export interface StateFromProps {
  activeFilter: FilterTab;
  open: boolean;
  filterSelectionMode: FilterSelectionMode;
}

export interface DispatchFromProps {
  close(): void;
  resetConditions(): void;
  changeActiveFilterTab(activeFilter: FilterTab): void;
  setFilterSelectionMode(filterSelectionMode: FilterSelectionMode): void;
}

export type Props = StateFromProps & DispatchFromProps;

export default class CardFilter extends React.PureComponent<Props> {
  private handleCloseFilter = (): void => {
    this.props.close();
  };

  private handleResetConditions = (): void => {
    this.props.resetConditions();
  };

  private handleChangeActiveFilterTab = (activeFilter: FilterTab): void => {
    this.props.changeActiveFilterTab(activeFilter);
  };

  private handleOnChangeFilterSelectionMode: <V>(
    _: 'filterSelectionMode',
    value: boolean
  ) => void = (_, value): void => {
    this.props.setFilterSelectionMode(value ? 'singular' : 'multiple');
  };

  public render(): React.ReactNode {
    const { activeFilter, open, filterSelectionMode } = this.props;
    const isMultiple = filterSelectionMode === 'multiple';
    return (
      <div className={classNames(['card-filter-container', { open }])}>
        <h1 className="card-filter-title">絞り込みメニュー</h1>
        <div className="filter-selection-mode">
          <div className="selection-mode-label" data-label="選択モード">
            <SwitchItem<'filterSelectionMode'>
              itemName="filterSelectionMode"
              onChangeValue={this.handleOnChangeFilterSelectionMode}
              isOn={!isMultiple}
              labelOff="複数"
              labelOn="単数"
            />
          </div>
        </div>
        <div className="card-filter-buttons">
          <FilterTabs
            tabs={filterTabNames}
            activeTab={activeFilter}
            onTabChanged={this.handleChangeActiveFilterTab}
          />
          <FilterActions
            resetConditions={this.handleResetConditions}
            closeFilter={this.handleCloseFilter}
          />
        </div>
        <div
          className={classNames([
            'card-filter-content',
            { active: activeFilter === 'BASIC' },
          ])}
        >
          <BaseFilter />
        </div>
        <div
          className={classNames([
            'card-filter-content',
            { active: activeFilter === 'DETAIL' },
          ])}
        >
          <DetailFilter />
        </div>
        <div
          className={classNames([
            'card-filter-content',
            { active: activeFilter === 'STRAT' },
          ])}
        >
          <StrategyFilter />
        </div>
      </div>
    );
  }
}
