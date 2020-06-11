import './DeckDummyCard.css';
import React from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons/faMinusCircle';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import type { DatalistState } from '../../modules/datalist';
import type { DeckCardDummy } from '../../modules/deck';

export interface OwnProps {
  index: number;
  deckCard: DeckCardDummy;
  active: boolean;
  search: boolean;
  enableMoveLeft: boolean;
  enableMoveRight: boolean;
  onActive: (index: number) => void;
  onRemoveDeck: (index: number) => void;
  onToggleSearch: (
    index: number,
    condition: {
      belongState?: string;
      cost: string;
      unitType?: string;
    }
  ) => void;
  onMoveLeft: (index: number) => void;
  onMoveRight: (index: number) => void;
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
}

export type Props = StateFromProps & OwnProps & DispatchFromProps;

type MoveDirection = 'left' | 'right';

interface LocalState {
  moveFrom: MoveDirection | null;
}

export default class DeckDummyCard extends React.PureComponent<
  Props,
  LocalState
> {
  state: Readonly<LocalState> = { moveFrom: null };

  public componentDidUpdate(prevProps: Readonly<Props>): void {
    if (prevProps === this.props) {
      return;
    }
    const diff = prevProps.index - this.props.index;
    if (diff === 0) {
      this.setState({ moveFrom: null });
    } else {
      this.setState({ moveFrom: diff > 0 ? 'right' : 'left' });
    }
  }

  private handleActive = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ): void => {
    event.stopPropagation();
    const { index, onActive } = this.props;
    onActive(index);
  };

  private handleRemove = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ): void => {
    event.stopPropagation();
    const { index, onRemoveDeck } = this.props;
    onRemoveDeck(index);
  };

  private handleSearch = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ): void => {
    event.stopPropagation();
    const { index, onToggleSearch, deckCard } = this.props;
    onToggleSearch(index, deckCard);
  };

  private handleMoveLeft = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ): void => {
    event.stopPropagation();
    this.setState({ moveFrom: null });
    const { index, onMoveLeft } = this.props;
    onMoveLeft(index);
  };

  private handleMoveRight = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ): void => {
    event.stopPropagation();
    this.setState({ moveFrom: null });
    const { index, onMoveRight } = this.props;
    onMoveRight(index);
  };

  private handleChangeDeckValue = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
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
      index,
      deckCard,
      active,
      search,
      belongStates,
      costs,
      unitTypes,
      enableMoveLeft,
      enableMoveRight,
    } = this.props;
    const style: React.CSSProperties = {};
    const styleState: React.CSSProperties = {};
    const belongState = deckCard.belongState
      ? belongStates.find((v) => v.id === deckCard.belongState)
      : undefined;
    const cost = deckCard.cost
      ? costs.find((v) => v.id === deckCard.cost)
      : undefined;
    const unitType = deckCard.unitType
      ? unitTypes.find((v) => v.id === deckCard.unitType)
      : undefined;
    let stateId = '';
    let stateName = '';
    let hasState = false;
    if (belongState) {
      style.backgroundColor = belongState.thincolor;
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
    const moveFrom = this.state.moveFrom;
    const indexClass = index % 2 === 0 ? 'even' : 'odd';
    return (
      <div
        className={classNames('deck-card', 'deck-dummy-card', indexClass, {
          'has-state': hasState,
          active,
          'from-right': moveFrom === 'right',
          'from-left': moveFrom === 'left',
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
        </div>
        <div className="deck-card-inner-bottom" />
        <div className="deck-dummy-edit">
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
        <div className="tool-box">
          <button className="remove" onClick={this.handleRemove}>
            <FontAwesomeIcon icon={faMinusCircle} className="circle-icon" />
          </button>
          <button
            className={classNames('tool-button', 'search', { enable: search })}
            title="勢力・コスト・兵種で絞り込み"
            onClick={this.handleSearch}
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
          <button
            className={classNames('tool-button', 'move-left', {
              enabled: enableMoveLeft,
            })}
            title="左へ移動"
            onClick={this.handleMoveLeft}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <button
            className={classNames('tool-button', 'move-right', {
              enabled: enableMoveRight,
            })}
            title="右へ移動"
            onClick={this.handleMoveRight}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
    );
  }
}
