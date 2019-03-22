import './DeckDummyCard.css';
import React from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons/faMinusCircle';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { DatalistState } from '../../modules/datalist';
import { DeckCard } from '../../modules/deck';

export interface OwnProps {
  index: number;
  deckCard: DeckCard;
  active: boolean;
  search: boolean;
}

export interface StateFromProps {
  belongStates: DatalistState['filterContents']['belongStates'];
  costs: DatalistState['filterContents']['costs'];
  unitTypes: DatalistState['filterContents']['unitTypes'];
}

export interface DispatchFromProps {
  setDeckValue: (
    index: number,
    deckCard: { belongState?: string; cost?: string; unitType?: string }
  ) => void;
  setActiveCard: (index: number) => void;
  removeDeck: (index: number) => void;
  toggleSearch: (index: number) => void;
}

type Props = StateFromProps & OwnProps & DispatchFromProps;

export default class DeckDummyCard extends React.PureComponent<Props> {
  private handleActive = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.stopPropagation();
    const { index, setActiveCard } = this.props;
    setActiveCard(index);
  };

  private handleRemove = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.stopPropagation();
    const { index, removeDeck } = this.props;
    removeDeck(index);
  };

  private handleSearch = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.stopPropagation();
    const { index, toggleSearch } = this.props;
    toggleSearch(index);
  };

  private handleChangeDeckValue = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { index, setDeckValue } = this.props;
    const key = event.currentTarget.name as 'belongState' | 'cost' | 'unitType';
    let value: string | undefined = event.currentTarget.value;
    if (value === '') {
      value = undefined;
    }
    setDeckValue(index, { [key]: value });
  };

  public render(): React.ReactNode {
    const {
      deckCard,
      active,
      search,
      belongStates,
      costs,
      unitTypes,
    } = this.props;
    const style: React.CSSProperties = {};
    const styleState: React.CSSProperties = {};
    const belongState = deckCard.belongState
      ? belongStates.find(v => v.id === deckCard.belongState)
      : undefined;
    const cost = deckCard.cost
      ? costs.find(v => v.id === deckCard.cost)
      : undefined;
    const unitType = deckCard.unitType
      ? unitTypes.find(v => v.id === deckCard.unitType)
      : undefined;
    let stateId = '';
    let stateName = '';
    let hasState = false;
    if (belongState) {
      style.backgroundColor = belongState.thinColor;
      styleState.backgroundColor = belongState.color;
      stateId = belongState.id;
      stateName = belongState.nameShort || '';
      hasState = true;
    }
    let costName = '';
    if (cost) {
      costName = cost.name;
    }
    const styleUnitType: React.CSSProperties = {};
    let unitTypeId = '';
    let unitTypeName = '';
    if (unitType) {
      unitTypeId = unitType.id;
      unitTypeName = unitType.nameShort || '';
    } else {
      styleUnitType.display = 'none';
    }
    const belongStatesOptions: JSX.Element[] = [];
    belongStates.forEach((state, i) => {
      belongStatesOptions.push(
        <option value={state.id} key={i}>
          {state.name}
        </option>
      );
    });
    const costsOptions: JSX.Element[] = [];
    costs.forEach((cost, i) => {
      costsOptions.push(
        <option value={cost.id} key={i}>
          {cost.name}
        </option>
      );
    });
    const unitTypesOptions: JSX.Element[] = [];
    unitTypes.forEach((unitType, i) => {
      unitTypesOptions.push(
        <option value={unitType.id} key={i}>
          {unitType.nameShort || unitType.name}
        </option>
      );
    });
    return (
      <div
        className={classNames('deck-dummy-card', {
          'has-state': hasState,
          active,
        })}
        style={style}
        onClick={this.handleActive}
      >
        <div className="deck-card-inner-top" style={styleState}>
          <span className="state">{stateName}</span>
          <span className="cost" data-label="コスト">
            {costName}
          </span>
          <span className="unit" style={styleUnitType} data-label="兵種">
            {unitTypeName}
          </span>
          <div className="edit">
            <span className="select-item-container" data-label="勢力">
              <select
                className="select-item"
                name="belongState"
                value={stateId}
                onChange={this.handleChangeDeckValue}
              >
                <option value="" />
                {belongStatesOptions}
              </select>
            </span>
            <span className="select-item-container" data-label="コスト">
              <select
                className="select-item"
                name="cost"
                value={deckCard.cost}
                onChange={this.handleChangeDeckValue}
              >
                {costsOptions}
              </select>
            </span>
            <span className="select-item-container" data-label="兵種">
              <select
                className="select-item"
                name="unitType"
                value={unitTypeId}
                onChange={this.handleChangeDeckValue}
              >
                <option value="" />
                {unitTypesOptions}
              </select>
            </span>
          </div>
        </div>
        <div className="deck-card-inner-bottom">
          <div className="tool-box">
            <button className="remove" onClick={this.handleRemove}>
              <FontAwesomeIcon icon={faMinusCircle} />
            </button>
            <button
              className={classNames('search', { enable: search })}
              onClick={this.handleSearch}
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </div>
      </div>
    );
  }
}
