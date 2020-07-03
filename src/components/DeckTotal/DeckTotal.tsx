import './DeckTotal.css';
import React from 'react';
import classNames from 'classnames';
import { FilterItem } from '3594t-deck';

interface TotalSkill {
  skill: FilterItem;
  count: number;
  cost: number;
}

interface TotalUnitType {
  unitType: FilterItem;
  count: number;
  cost: number;
}

interface Props {
  /** 総武力 */
  totalForce: number;
  /** 総知力 */
  totalIntelligence: number;
  /** 総知力将器加算値 */
  intelligenceByGenMain: number;
  /** 総征圧力 */
  totalConquest: number;
  /** 総征圧力将器加算値 */
  conquestByGenMain: number;
  /** 征圧ランク */
  conquestRank: string;
  /** 総コスト */
  totalCost: number;
  /** 上限コスト */
  limitCost: number;
  /** 最大士気 */
  maxMorale: number;
  /** 最大士気将器加算値 */
  maxMoraleByGenMain: number;
  /** 魅力による士気 */
  tolalMoraleByCharm: number;
  /** 主将器による士気 */
  tolalMoraleByGenMain: number;
  /** ダミー含む */
  hasDummy: boolean;
  /** 勢力未指定ダミー含む */
  hasStateDummy: boolean;
  /** 合計特技 */
  totalSkills: TotalSkill[];
  /** 合計兵種 */
  totalUnitTypes: TotalUnitType[];
}

interface LocalState {
  showTotalAll: boolean;
}

export default class DeckTotal extends React.Component<Props, LocalState> {
  state: Readonly<LocalState> = { showTotalAll: false };

  private handleShowTotalAll = (): void => {
    this.setState({ showTotalAll: true });
  };

  private handleHideTotalAll = (): void => {
    this.setState({ showTotalAll: false });
  };

  public render(): React.ReactNode {
    const {
      totalForce,
      totalIntelligence,
      intelligenceByGenMain,
      totalConquest,
      conquestByGenMain,
      conquestRank,
      totalCost,
      limitCost,
      maxMorale,
      maxMoraleByGenMain,
      tolalMoraleByCharm,
      tolalMoraleByGenMain,
      hasDummy,
      hasStateDummy,
      totalSkills,
      totalUnitTypes,
    } = this.props;
    const { showTotalAll } = this.state;
    let costRemain = totalCost - limitCost;
    let costRemainText = '残り';
    let over = false;
    let under = false;
    if (costRemain > 0) {
      costRemainText = 'コストオーバー';
      over = true;
    } else if (costRemain < 0) {
      costRemain *= -1;
      under = true;
    }
    // 開幕士気
    const startMorale = (tolalMoraleByCharm + tolalMoraleByGenMain) / 100;
    const startMoraleByCharm = tolalMoraleByCharm / 100;
    const startMoraleByGenMain = tolalMoraleByGenMain / 100;
    // 特技合計
    const skillTags = totalSkills.map(({ skill, count, cost }, i) => {
      return (
        <div key={i} className="type-count">
          <span className="skill">{skill.nameShort}</span>×{count}({cost / 10}
          <span className="cost-label">コスト</span>)
        </div>
      );
    });
    // 兵種合計
    const unitTypeTags = totalUnitTypes.map(({ unitType, count, cost }, i) => {
      return (
        <div key={i} className="type-count">
          <span className="unit">{unitType.name}</span>×{count}({cost / 10}
          <span className="cost-label">コスト</span>)
        </div>
      );
    });
    return (
      <div className="deck-total">
        <div className="deck-inner">
          <div className="total-params">
            <div className="total-row">
              <div className="total" data-label="総武力">
                <span className={classNames('force', { dummy: hasDummy })}>
                  {totalForce}
                </span>
              </div>
              <div className="total" data-label="総知力">
                <span
                  className={classNames('has-gen-main', {
                    active: intelligenceByGenMain > 0,
                  })}
                >
                  将器込み
                </span>
                <span
                  className={classNames('intelligence', { dummy: hasDummy })}
                >
                  {totalIntelligence}
                  <span
                    className={classNames('breakdown', {
                      active: intelligenceByGenMain > 0,
                    })}
                  >
                    ({totalIntelligence - intelligenceByGenMain}
                    <span className="addition-by-gen-main">
                      &#43;{intelligenceByGenMain}
                    </span>
                    )
                  </span>
                </span>
              </div>
              <div className="total" data-label="総征圧力">
                <span
                  className={classNames('has-gen-main', {
                    active: conquestByGenMain > 0,
                  })}
                >
                  将器込み
                </span>
                <span
                  className={classNames('conquest-rank', { dummy: hasDummy })}
                >
                  {conquestRank}
                </span>
                <span className={classNames('conquest', { dummy: hasDummy })}>
                  {totalConquest}
                  <span
                    className={classNames('breakdown', {
                      active: conquestByGenMain > 0,
                    })}
                  >
                    ({totalConquest - conquestByGenMain}
                    <span className="addition-by-gen-main">
                      &#43;{conquestByGenMain}
                    </span>
                    )
                  </span>
                </span>
              </div>
            </div>
            <div className="total-row">
              <div className="total total-cost" data-label="総コスト">
                <span className="cost">{(totalCost / 10).toFixed(1)}</span>
                <span className={classNames('cost-remain', { over, under })}>
                  ({costRemainText} {(costRemain / 10).toFixed(1)})
                </span>
              </div>
              <div className="total" data-label="最大士気">
                <span
                  className={classNames('has-gen-main', {
                    active: maxMoraleByGenMain > 0,
                  })}
                >
                  将器込み
                </span>
                <span
                  className={classNames('max-morale', { dummy: hasStateDummy })}
                >
                  {maxMorale}
                  <span
                    className={classNames('breakdown', {
                      active: maxMoraleByGenMain > 0,
                    })}
                  >
                    ({maxMorale - maxMoraleByGenMain}
                    <span className="addition-by-gen-main">
                      &#43;{maxMoraleByGenMain}
                    </span>
                    )
                  </span>
                </span>
              </div>
              <div className="total" data-label="開幕士気">
                <span
                  className={classNames('has-gen-main', {
                    active: startMoraleByGenMain > 0,
                  })}
                >
                  将器込み
                </span>
                <span className="start-morale">
                  {startMorale}
                  <span
                    className={classNames('breakdown', {
                      active: startMoraleByGenMain > 0,
                    })}
                  >
                    ({startMoraleByCharm}
                    <span className="addition-by-gen-main">
                      &#43;{startMoraleByGenMain}
                    </span>
                    )
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div
            className={classNames('total-type-counts', {
              'show-total': showTotalAll,
            })}
          >
            <div className="total" data-label="特技合計">
              {skillTags}
            </div>
            <div className="total" data-label="兵種合計">
              {unitTypeTags}
            </div>
          </div>
          <button
            className={classNames('switch-total-all', {
              'show-button': showTotalAll,
            })}
            onClick={this.handleHideTotalAll}
          >
            <span className="up-icon">
              <span className="icon-inner" />
            </span>
          </button>
        </div>
        <button
          className={classNames('switch-total-all', {
            'show-button': !showTotalAll,
          })}
          onClick={this.handleShowTotalAll}
        >
          <span className="down-icon">
            <span className="icon-inner" />
          </span>
        </button>
      </div>
    );
  }
}
