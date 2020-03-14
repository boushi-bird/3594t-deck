import './AssistGeneralCard.css';
import React from 'react';
import classNames from 'classnames';
import LazyLoad from 'react-lazyload';
import { AssistGeneral } from '3594t-deck';

interface Props {
  general: AssistGeneral;
  show?: boolean;
  showStrategyExplanation: boolean;
  showAddButtons: boolean;
  onShowDetail?: (general: AssistGeneral) => void;
}

export default class AssistGeneralCard extends React.PureComponent<Props> {
  private handleAssistGeneralClick = (): void => {
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
      // showAddButtons,
    } = this.props;
    // const clickable = showAddButtons;
    // TODO 詳細表示
    const clickable = false;
    const style: React.CSSProperties = {
      backgroundColor: general.state.thincolor,
    };
    const styleState: React.CSSProperties = {
      backgroundColor: general.state.color,
    };
    if (show != null && !show) {
      style.display = 'none';
    }
    const stratName = general.strategy.name;
    const stratCaterogyName = general.strategy.category?.name || '';
    const stratExplanation = general.strategy.explanation;
    const stratExplanationElements: JSX.Element[] = [];
    stratExplanation.split('\n').forEach((exp, i) => {
      stratExplanationElements.push(<span key={i}>{exp}</span>);
    });
    const rangeCode = general.strategy.range?.code;
    const strategyRangeUrl = rangeCode
      ? `https://3594t.net/img/strat_range/${rangeCode}.png`
      : '';
    return (
      <div
        className={classNames('assist-general-card', { clickable })}
        style={style}
        onClick={this.handleAssistGeneralClick}
      >
        <span className="state" style={styleState}>
          {general.state.nameShort}
        </span>
        <span className="version">{general.version}</span>
        <span className="rarity">遊軍</span>
        <span className="name">{general.name}</span>
        <span className="image">
          <LazyLoad
            height={64}
            once={true}
            scroll={false}
            resize={false}
            placeholder={<div className="no-image general-thumb" />}
          >
            <img className="general-thumb" src={general.avatarUrl} />
          </LazyLoad>
        </span>
        <span
          className={classNames('strategy', { show: !showStrategyExplanation })}
          data-label="戦技名"
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
        <span className="strategy-range" data-label="効果範囲">
          <img className="range-image" src={strategyRangeUrl} />
        </span>
        <span className="buttons">調整中</span>
      </div>
    );
  }
}