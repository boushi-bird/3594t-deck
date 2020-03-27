import './DeckConfig.css';
import React from 'react';
import {
  MIN_DECK_COST_LIMIT,
  MAX_DECK_COST_LIMIT,
  STEP_DECK_COST_LIMIT,
  MAX_DECK_ASSIST_CARD_COUNT,
} from '../../const';
import { DeckConstraints, SameCardConstraint } from '../../modules/deck';
import NumberSelect from '../../components/NumberSelect';
import RadioButton from '../../components/RadioButton';

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
      assistCardLimit,
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
            <button className="action-buton-ok" onClick={closeDeckConfig}>
              OK
            </button>
          </div>
          <div className="deck-config-body">
            <section className="filter-section">
              <h2 className="title">コスト 上限</h2>
              <NumberSelect<DeckConstraintsKey>
                itemName="limitCost"
                onChangeValue={this.handleOnChangeDeckConstraints}
                value={limitCost}
                max={MAX_DECK_COST_LIMIT}
                min={MIN_DECK_COST_LIMIT}
                step={STEP_DECK_COST_LIMIT}
                displayText={this.costDisplayText}
              />
            </section>
            <section className="filter-section">
              <h2 className="title">遊軍</h2>
              <NumberSelect<DeckConstraintsKey>
                itemName="assistCardLimit"
                onChangeValue={this.handleOnChangeDeckConstraints}
                value={assistCardLimit}
                max={MAX_DECK_ASSIST_CARD_COUNT}
                min={0}
                step={1}
                displayText={this.assistLimitDisplayText}
              />
            </section>
            <section className="filter-section same-card-constraint">
              <h2 className="title">同名武将 制限</h2>
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
            </section>
            <section className="filter-section same-card-constraint">
              <h2 className="title">同名武将・遊軍 制限</h2>
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
            </section>
          </div>
        </div>
      </div>
    );
  }
}
