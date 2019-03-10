import './GeneralCard.css';
import React from 'react';
import { DatalistState } from '../../modules/datalist';

interface Props {
  general: DatalistState['generals'][number];
}

export default class GeneralCard extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { general } = this.props;
    const style: React.CSSProperties = {
      backgroundColor: general.state.thinColor,
    };
    const styleState: React.CSSProperties = {
      backgroundColor: general.state.color,
    };
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
    if (general.strategy) {
      stratName = general.strategy.name;
      stratMorale = general.strategy.morale;
    }
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
        <span className="strategy" data-label="計略名">
          {stratName}
        </span>
        <span className="strategy-morale" data-label1="必要" data-label2="士気">
          {stratMorale}
        </span>
      </div>
    );
  }
}
