import './GeneralCard.css';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons/faPlusCircle';
import { DatalistState } from '../../modules/datalist';
import { DeckCardGeneral } from '../../modules/deck';

interface Props {
  general: DatalistState['generals'][number];
  show?: boolean;
  enabledAddDeck: boolean;
  onAddDeck: (card: DeckCardGeneral) => void;
}

export default class GeneralCard extends React.PureComponent<Props> {
  private handleAddDeckClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    const { general, onAddDeck } = this.props;
    const genMain = event.currentTarget.dataset['genMain'];
    onAddDeck({
      general: general.id,
      belongState: general.raw.state,
      cost: general.raw.cost,
      unitType: general.raw.unit_type,
      genMain,
    });
  };

  public render(): React.ReactNode {
    const { general, show, enabledAddDeck } = this.props;
    const style: React.CSSProperties = {
      backgroundColor: general.state.thinColor,
    };
    const styleState: React.CSSProperties = {
      backgroundColor: general.state.color,
    };
    if (show != null && !show) {
      style.display = 'none';
    }
    const skills: JSX.Element[] = [];
    general.skills.forEach(skill => {
      skills.push(
        <span className="skill" key={skill.id}>
          {skill.nameShort}
        </span>
      );
    });
    if (skills.length === 0) {
      skills.push(
        <span className="no-skill" key={0}>
          特技なし
        </span>
      );
    }
    let stratName = '';
    let stratMorale = '';
    let stratExplanation = '';
    if (general.strategy) {
      stratName = general.strategy.name;
      stratMorale = general.strategy.morale;
      stratExplanation = general.strategy.explanation;
      stratExplanation = stratExplanation.replace(/\<br\s*\/?\>/g, '\n');
    }
    const genMains: JSX.Element[] = [];
    general.genMains.forEach((genMain, i) => {
      genMains.push(
        <button
          className="gen-main"
          key={i}
          disabled={!enabledAddDeck}
          data-gen-main={genMain.id}
          onClick={this.handleAddDeckClick}
        >
          {genMain.nameShort}
          <FontAwesomeIcon icon={faPlusCircle} />
        </button>
      );
    });
    return (
      <div className="general-card" style={style}>
        <span className="state" style={styleState}>
          {general.state.nameShort}
        </span>
        <span className="version">{general.version}</span>
        <span className="rarity">{general.rarity.name}</span>
        <span className="name">{general.name}</span>
        <span className="image">
          <img className="general-thumb" />
        </span>
        <span className="cost" data-label="コスト">
          {general.cost.name}
        </span>
        <span className="unit" data-label="兵種">
          {general.unitType.nameShort}
        </span>
        <span className="force" data-label="武">
          {general.force}
        </span>
        <span className="intelligence" data-label="知">
          {general.intelligence}
        </span>
        <span className="conquest" data-label="制圧">
          {general.conquest}
        </span>
        <span className="skills">{skills}</span>
        <span className="strategy" data-label="計略名" title={stratExplanation}>
          {stratName}
        </span>
        <span className="strategy-morale" data-label1="必要" data-label2="士気">
          {stratMorale}
        </span>
        <span className="gen-mains" data-label="主将器">
          {genMains}
        </span>
        <span className="buttons">
          <button
            className="add-deck"
            disabled={!enabledAddDeck}
            onClick={this.handleAddDeckClick}
          >
            <FontAwesomeIcon icon={faPlusCircle} />
          </button>
        </span>
      </div>
    );
  }
}
