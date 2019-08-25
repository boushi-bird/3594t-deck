import './DeckConfig.css';
import React from 'react';
import { DeckConstraints, SameCardConstraint } from '../../modules/datalist';
import NumberSelect from '../../components/NumberSelect';
import RadioButton from '../../components/RadioButton';

export interface StateFromProps extends DeckConstraints {
  show: boolean;
}

export interface DispatchFromProps {
  closeDeckConfig: () => void;
  setDeckConstraints: (deckConstraints: Partial<DeckConstraints>) => void;
}

type Props = StateFromProps & DispatchFromProps;

export default class DeckConfig extends React.PureComponent<Props> {
  private costDisplayText(value: number): string {
    return `${value / 10}`;
  }

  private handleOnSetDeckConstraints = (
    deckConstraints: Partial<DeckConstraints>
  ) => {
    this.props.setDeckConstraints(deckConstraints);
  };

  private handleOnClickSameCard = (value: SameCardConstraint) => {
    this.props.setDeckConstraints({ sameCard: value });
  };

  public render(): React.ReactNode {
    const { show, limitCost, sameCard, closeDeckConfig } = this.props;
    const style: React.CSSProperties = {};
    if (!show) {
      style.display = 'none';
    }
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
              <NumberSelect
                itemName="limitCost"
                setCondition={this.handleOnSetDeckConstraints}
                value={limitCost}
                max={250}
                min={10}
                step={5}
                displayText={this.costDisplayText}
              />
            </section>
            <section className="filter-section same-card-constraint">
              <h2 className="title">同名武将 制限</h2>
              <RadioButton<SameCardConstraint>
                value="personal"
                checked={sameCard === 'personal'}
                onClick={this.handleOnClickSameCard}
              >
                同名武将不可(通常ルール)
              </RadioButton>
              <RadioButton<SameCardConstraint>
                value="personal-strategy"
                checked={sameCard === 'personal-strategy'}
                onClick={this.handleOnClickSameCard}
              >
                同名武将かつ同計略不可
              </RadioButton>
            </section>
          </div>
        </div>
      </div>
    );
  }
}
