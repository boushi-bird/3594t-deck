import './DeckConfig.css';
import React from 'react';
import {
  DECK_COST_LIMIT,
  DECK_GENERAL_CARD_COUNT,
  DECK_ASSIST_CARD_COUNT,
  GEN_MAIN_AWAKENING_LIMIT,
} from '../../const';
import type { DeckConstraints, SameCardConstraint } from '../../modules/deck';
import NumberSelect from '../../components/NumberSelect';
import RadioButton from '../../components/RadioButton';
import SwitchItem from '../../components/SwitchItem';

type DeckConstraintsKey = keyof DeckConstraints;

export interface StateFromProps extends DeckConstraints {
  show: boolean;
}

export interface DispatchFromProps {
  closeDeckConfig: () => void;
  setDeckConstraints: (deckConstraints: Partial<DeckConstraints>) => void;
  sliceDeckAssist: () => void;
}

type Props = StateFromProps & DispatchFromProps;

// general: 同名武将不可(通常ルール)
// general-strategy: 同名武将かつ同計略不可
type SameCardGeneralConstraint = 'general' | 'general-strategy';

// exclude-assist: 同名遊軍不可(通常ルール)
// assist: 同名遊軍可
type SameCardAssistConstraint = 'exclude-assist' | 'assist';

function toSameCardConstraint(
  generalConst: SameCardGeneralConstraint,
  assistConst: SameCardAssistConstraint
): SameCardConstraint {
  if (generalConst === 'general') {
    return assistConst === 'assist' ? 'personal-assist' : 'personal';
  }
  return assistConst === 'assist'
    ? 'personal-strategy'
    : 'personal-strategy-exclude-assist';
}

function toLocalSameCardConstraint(
  sameCard: SameCardConstraint
): {
  generalConst: SameCardGeneralConstraint;
  assistConst: SameCardAssistConstraint;
} {
  return {
    generalConst:
      sameCard === 'personal-strategy' ||
      sameCard === 'personal-strategy-exclude-assist'
        ? 'general-strategy'
        : 'general',
    assistConst:
      sameCard === 'personal-assist' || sameCard === 'personal-strategy'
        ? 'assist'
        : 'exclude-assist',
  };
}

export default class DeckConfig extends React.PureComponent<Props> {
  private costDisplayText(value: number): string {
    return `${value / 10}`;
  }

  private assistLimitDisplayText(value: number): string {
    if (value === 0) {
      return 'なし';
    }
    if (value === 1) {
      return 'あり';
    }
    return `${value}`;
  }

  private handleOnChangeDeckConstraints: <V>(
    itemName: DeckConstraintsKey,
    value: V
  ) => void = (itemName, value) => {
    this.props.setDeckConstraints({ [itemName]: value });
    if (itemName === 'assistCardLimit') {
      this.props.sliceDeckAssist();
    }
  };

  private handleOnChangeSameCardGeneral: (
    itemName: 'sameCard',
    value: SameCardGeneralConstraint
  ) => void = (itemName, value) => {
    const { assistConst } = toLocalSameCardConstraint(this.props.sameCard);
    const sameCard: SameCardConstraint = toSameCardConstraint(
      value,
      assistConst
    );
    this.handleOnChangeDeckConstraints(itemName, sameCard);
  };

  private handleOnChangeSameCardAssist: (
    itemName: 'sameCard',
    value: SameCardAssistConstraint
  ) => void = (itemName, value) => {
    const { generalConst } = toLocalSameCardConstraint(this.props.sameCard);
    const sameCard: SameCardConstraint = toSameCardConstraint(
      generalConst,
      value
    );
    this.handleOnChangeDeckConstraints(itemName, sameCard);
  };

  public render(): React.ReactNode {
    const {
      show,
      limitCost,
      sameCard,
      generalCardLimit,
      assistCardLimit,
      genMainAwakeningLimit,
      exchange,
      closeDeckConfig,
    } = this.props;
    const style: React.CSSProperties = {};
    if (!show) {
      style.display = 'none';
    }
    const { generalConst, assistConst } = toLocalSameCardConstraint(sameCard);
    return (
      <div className="deck-config" style={style}>
        <div className="deck-config-inner">
          <div className="deck-config-title">デッキ設定</div>
          <div className="deck-config-buttons">
            <button className="action-button-ok" onClick={closeDeckConfig}>
              OK
            </button>
          </div>
          <div className="deck-config-body">
            <section className="filter-section">
              <h2 className="title">コスト 上限</h2>
              <div className="deck-filter-content">
                <NumberSelect<DeckConstraintsKey>
                  itemName="limitCost"
                  onChangeValue={this.handleOnChangeDeckConstraints}
                  value={limitCost}
                  displayText={this.costDisplayText}
                  defaultValueLabel="(通常ルール)"
                  {...DECK_COST_LIMIT}
                />
              </div>
            </section>
            <section className="filter-section">
              <h2 className="title">武将カード最大枚数</h2>
              <div className="deck-filter-content">
                <NumberSelect<DeckConstraintsKey>
                  itemName="generalCardLimit"
                  onChangeValue={this.handleOnChangeDeckConstraints}
                  value={generalCardLimit}
                  defaultValueLabel="(通常ルール)"
                  {...DECK_GENERAL_CARD_COUNT}
                />
              </div>
            </section>
            <section className="filter-section">
              <h2 className="title">遊軍</h2>
              <div className="deck-filter-content">
                <NumberSelect<DeckConstraintsKey>
                  className="assist-card-limit"
                  itemName="assistCardLimit"
                  onChangeValue={this.handleOnChangeDeckConstraints}
                  value={assistCardLimit}
                  displayText={this.assistLimitDisplayText}
                  {...DECK_ASSIST_CARD_COUNT}
                />
              </div>
            </section>
            <section className="filter-section same-card-constraint">
              <h2 className="title">同名武将 制限</h2>
              <div className="deck-filter-content">
                <RadioButton<DeckConstraintsKey, SameCardGeneralConstraint>
                  itemName="sameCard"
                  value="general"
                  checked={generalConst === 'general'}
                  onClick={this.handleOnChangeSameCardGeneral}
                >
                  同名武将登録不可(通常ルール)
                </RadioButton>
                <RadioButton<DeckConstraintsKey, SameCardGeneralConstraint>
                  itemName="sameCard"
                  value="general-strategy"
                  checked={generalConst === 'general-strategy'}
                  onClick={this.handleOnChangeSameCardGeneral}
                >
                  同名武将登録可、ただし同計略の同名武将は登録不可
                </RadioButton>
              </div>
            </section>
            <section className="filter-section same-card-constraint">
              <h2 className="title">同名武将・遊軍 制限</h2>
              <div className="deck-filter-content">
                <RadioButton<DeckConstraintsKey, SameCardAssistConstraint>
                  itemName="sameCard"
                  value="exclude-assist"
                  checked={assistConst === 'exclude-assist'}
                  onClick={this.handleOnChangeSameCardAssist}
                >
                  同名の武将・遊軍登録不可(通常ルール)
                </RadioButton>
                <RadioButton<DeckConstraintsKey, SameCardAssistConstraint>
                  itemName="sameCard"
                  value="assist"
                  checked={assistConst === 'assist'}
                  onClick={this.handleOnChangeSameCardAssist}
                >
                  同名の武将・遊軍登録可
                </RadioButton>
              </div>
            </section>
            <section className="filter-section">
              <h2 className="title">知勇一転</h2>
              <div className="deck-filter-content">
                <SwitchItem<DeckConstraintsKey>
                  itemName="exchange"
                  onChangeValue={this.handleOnChangeDeckConstraints}
                  isOn={exchange}
                  labelOff="通常"
                  labelOn="知勇一転"
                  width={200}
                />
              </div>
            </section>
            <section className="filter-section">
              <h2 className="title">覚醒できる主将器の最大ポイント数</h2>
              <div className="deck-filter-content">
                <NumberSelect<DeckConstraintsKey>
                  itemName="genMainAwakeningLimit"
                  onChangeValue={this.handleOnChangeDeckConstraints}
                  value={genMainAwakeningLimit}
                  defaultValueLabel="(通常ルール)"
                  {...GEN_MAIN_AWAKENING_LIMIT}
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}
