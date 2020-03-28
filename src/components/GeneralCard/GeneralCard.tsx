import './GeneralCard.css';
import React from 'react';
import classNames from 'classnames';
import LazyLoad from 'react-lazyload';
import { General } from '3594t-deck';
import AddButtonContainer from './AddButtonContainer';
import GenMains from './GenMains';

interface Props {
  general: General;
  show?: boolean;
  showStrategyExplanation: boolean;
  showAddButtons: boolean;
  onShowDetail?: (general: General) => void;
}

export default class GeneralCard extends React.PureComponent<Props> {
  private handleGeneralClick = (): void => {
    const { general, onShowDetail } = this.props;
    if (!onShowDetail) {
      return;
    }
    onShowDetail(general);
  };

  public render(): React.ReactNode {
    const {
      general,
      show,
      showStrategyExplanation,
      showAddButtons,
    } = this.props;
    const clickable = showAddButtons;
    const style: React.CSSProperties = {
      backgroundColor: general.state.thincolor,
    };
    const styleState: React.CSSProperties = {
      backgroundColor: general.state.color,
    };
    if (show != null && !show) {
      style.display = 'none';
    }
    const skills: JSX.Element[] = [];
    general.skills.forEach((skill) => {
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
    const stratName = general.strategy.name;
    const stratCaterogyName = general.strategy.stratCategoryName;
    const stratMorale = general.strategy.morale;
    const stratExplanation = general.strategy.explanation;
    const stratExplanationElements: JSX.Element[] = [];
    stratExplanation.split('\n').forEach((exp, i) => {
      stratExplanationElements.push(<span key={i}>{exp}</span>);
    });
    const extraArea: JSX.Element = showAddButtons ? (
      <AddButtonContainer general={general} show={show} />
    ) : (
      <GenMains genMains={general.genMains} officialUrl={general.officialUrl} />
    );
    return (
      <div
        className={classNames('general-card', { clickable })}
        style={style}
        onClick={this.handleGeneralClick}
      >
        <span className="state" style={styleState}>
          {general.state.nameShort}
        </span>
        <span className="version">{general.version}</span>
        <span className="rarity">{general.rarity.name}</span>
        <span className="name">{general.name}</span>
        <span className="image">
          <LazyLoad
            height={64}
            once={true}
            scroll={false}
            resize={false}
            placeholder={<div className="no-image general-thumb" />}
          >
            <img className="general-thumb" src={general.avatarUrl(false)} />
          </LazyLoad>
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
        <span
          className={classNames('strategy', { show: !showStrategyExplanation })}
          data-label="計略名"
          title={stratExplanation}
        >
          {stratName}
        </span>
        <span
          className={classNames('strategy-category', {
            show: !showStrategyExplanation,
          })}
        >
          [{stratCaterogyName}]
        </span>
        <span
          className={classNames('strategy-explanation', {
            show: showStrategyExplanation,
          })}
        >
          {stratExplanationElements}
        </span>
        <span className="strategy-morale" data-label1="必要" data-label2="士気">
          {stratMorale}
        </span>
        {extraArea}
      </div>
    );
  }
}
