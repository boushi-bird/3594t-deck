import './DeckDummyCard.css';
import React from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons/faMinusCircle';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { DatalistState } from '../../modules/datalist';
import { DeckCard } from '../../modules/deck';

interface Props {
  index: number;
  deckCard: DeckCard;
  active: boolean;
  belongStates: DatalistState['filterContents']['belongStates'];
  costs: DatalistState['filterContents']['costs'];
  unitTypes: DatalistState['filterContents']['unitTypes'];
  onActive: (index: number) => void;
  onRemoveDeck: (index: number) => void;
}

export default class DeckDummyCard extends React.PureComponent<Props> {
  private handleActive = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.stopPropagation();
    const { index, onActive } = this.props;
    onActive(index);
  };

  private handleRemove = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.stopPropagation();
    const { index, onRemoveDeck } = this.props;
    onRemoveDeck(index);
  };

  public render(): React.ReactNode {
    const { deckCard, active, belongStates, costs, unitTypes } = this.props;
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
    let stateName = '';
    let hasState = false;
    if (belongState) {
      style.backgroundColor = belongState.thinColor;
      styleState.backgroundColor = belongState.color;
      stateName = belongState.nameShort || '';
      hasState = true;
    }
    let costName = '';
    if (cost) {
      costName = cost.name;
    }
    const styleUnitType: React.CSSProperties = {};
    let unitTypeName = '';
    if (unitType) {
      unitTypeName = unitType.nameShort || '';
    } else {
      styleUnitType.display = 'none';
    }
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
        </div>
        <div className="deck-card-inner-bottom">
          <div className="tool-box">
            <button className="remove" onClick={this.handleRemove}>
              <FontAwesomeIcon icon={faMinusCircle} />
            </button>
            <button className="search">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </div>
      </div>
    );
  }
}
