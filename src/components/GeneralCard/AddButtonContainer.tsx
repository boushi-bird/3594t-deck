import React from 'react';
import type {
  MapStateToProps,
  MapDispatchToProps,
  MergeProps,
} from 'react-redux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons/faPlusCircle';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons/faSyncAlt';
import type { General, AssistGeneral } from '3594t-deck';
import type { State } from '../../store';
import type {
  KeyLessDeckCardGeneral,
  DeckCard,
  DeckCardAssist,
  SameCardConstraint,
} from '../../modules/deck';
import { deckActions } from '../../modules/deck';
import isEnabledAddDeck from '../../containers/Common/isEnabledAddDeck';

interface StateFromProps {
  enabledAddDeck: boolean;
}

type DispatchFromProps = {
  onAddDeck: (card: KeyLessDeckCardGeneral) => void;
};

interface OwnProps {
  general: General;
  show?: boolean;
}

type Props = StateFromProps & DispatchFromProps & OwnProps;

class AddButton extends React.PureComponent<Props> {
  private handleAddDeckClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    const { general, onAddDeck } = this.props;
    event.stopPropagation();
    const genMain = event.currentTarget.dataset['genMain'];
    onAddDeck({
      general: general.id,
      genMain,
      genMainAwakening: false,
      pocket: false,
    });
  };

  public render(): React.ReactNode {
    const { general, enabledAddDeck } = this.props;
    const genMains: JSX.Element[] = [];
    general.genMains.forEach((genMain, i) => {
      const gm = general.genMainSp || genMain;
      genMains.push(
        <button
          className="gen-main"
          key={i}
          disabled={!enabledAddDeck}
          data-gen-main={genMain.id}
          onClick={this.handleAddDeckClick}
        >
          {gm.nameShort}
          <FontAwesomeIcon className="add-icon" icon={faPlusCircle} />
          <FontAwesomeIcon className="change-icon" icon={faSyncAlt} />
        </button>
      );
    });
    const genMainLabel = general.genMainSp != null ? '奇才将器' : '主将器';
    return (
      <>
        <span className="gen-mains" data-label={genMainLabel}>
          {genMains}
        </span>
        <span className="buttons">
          <button
            className="add-deck"
            disabled={!enabledAddDeck}
            onClick={this.handleAddDeckClick}
          >
            <FontAwesomeIcon className="add-icon" icon={faPlusCircle} />
            <FontAwesomeIcon className="change-icon" icon={faSyncAlt} />
          </button>
        </span>
      </>
    );
  }
}

interface ContainerStateFromProps {
  generals: General[];
  assistGenerals: AssistGeneral[];
  deckCards: DeckCard[];
  assistDeckCards: DeckCardAssist[];
  assistCardLimit: number;
  activeIndex: number | null;
  activeAssistIndex: number | null;
  sameCard: SameCardConstraint;
}

interface ContainerDispatchFromProps {
  addDeckGeneral: (card: KeyLessDeckCardGeneral) => void;
  changeDeckGeneral: (index: number, card: KeyLessDeckCardGeneral) => void;
}

type TMapStateToProps = MapStateToProps<
  ContainerStateFromProps,
  OwnProps,
  State
>;
type TMapDispatchToProps = MapDispatchToProps<
  ContainerDispatchFromProps,
  OwnProps
>;
type TMergeProps = MergeProps<
  ContainerStateFromProps,
  ContainerDispatchFromProps,
  OwnProps,
  Props
>;

const mapStateToProps: TMapStateToProps = (state) => ({
  generals: state.datalist.generals,
  assistGenerals: state.datalist.assistGenerals,
  deckCards: state.deck.deckCards,
  assistDeckCards: state.deck.assistDeckCards,
  assistCardLimit: state.deck.deckConstraints.assistCardLimit,
  activeIndex: state.deck.activeIndex,
  activeAssistIndex: state.deck.activeAssistIndex,
  sameCard: state.deck.deckConstraints.sameCard,
});

const mapDispatchToProps: TMapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      addDeckGeneral: deckActions.addDeckGeneral,
      changeDeckGeneral: deckActions.changeDeckGeneral,
    },
    dispatch
  );
};

interface DeckPersonalStrat {
  personal: string;
  strat: string;
}

// デッキに含まれている武将名IDと計略IDの配列を返す
function createDeckPersonals(
  state: ContainerStateFromProps,
  deckCards: DeckCard[]
): DeckPersonalStrat[] {
  const { generals, activeIndex } = state;
  const deckGenerals: string[] = [];
  deckCards.forEach((deckCard, i) => {
    if (activeIndex === i) {
      return;
    }
    if ('general' in deckCard) {
      deckGenerals.push(deckCard.general);
    }
  });
  return generals
    .filter((general) => {
      return deckGenerals.includes(general.id);
    })
    .map((v) => {
      return { personal: v.personal.id, strat: v.strategy.id };
    });
}

// 遊軍に含まれている武将名IDの配列を返す
function createAssistDeckPersonals(
  state: ContainerStateFromProps,
  assistDeckCards: DeckCardAssist[]
): string[] {
  const { assistGenerals, assistCardLimit } = state;
  const deckAssists: string[] = assistDeckCards
    .filter((ad, i) => i < assistCardLimit)
    .map((ad) => ad.assist);
  return assistGenerals
    .filter((assistGeneral) => {
      return deckAssists.includes(assistGeneral.id);
    })
    .map((ag) => ag.personal.id);
}

function isEnabledAddDeckGeneral(
  general: General,
  deckPersonals: DeckPersonalStrat[],
  deckAssistPersonals: string[],
  sameCard: SameCardConstraint
): boolean {
  // 遊軍の同名カード判別
  if (sameCard !== 'personal-strategy' && sameCard !== 'personal-assist') {
    const hasSameCard = deckAssistPersonals.some(
      (p) => p === general.personal.id
    );
    if (hasSameCard) {
      return false;
    }
  }

  // 武将カードの同名カード判別
  if (
    sameCard === 'personal-strategy' ||
    sameCard === 'personal-strategy-exclude-assist'
  ) {
    // 武将と計略が一致したときに同名カード扱い
    return !deckPersonals.some(
      (r) =>
        r.personal === general.personal.id && r.strat === general.strategy.id
    );
  } else {
    // 武将が一致したときに同名カード扱い
    return !deckPersonals.some((r) => r.personal === general.personal.id);
  }
}

const mergeProps: TMergeProps = (state, actions, ownProps) => {
  const {
    deckCards,
    assistDeckCards,
    activeIndex,
    activeAssistIndex,
    sameCard,
  } = state;
  const { general } = ownProps;
  // デッキにいる武将(武将名-計略単位)
  const deckPersonals = createDeckPersonals(state, deckCards);
  const deckAssistPersonals = createAssistDeckPersonals(state, assistDeckCards);
  const enabledAddDeck =
    activeAssistIndex == null &&
    isEnabledAddDeck(deckCards, activeIndex) &&
    isEnabledAddDeckGeneral(
      general,
      deckPersonals,
      deckAssistPersonals,
      sameCard
    );
  const sProps: StateFromProps = {
    enabledAddDeck,
  };
  const dProps: DispatchFromProps = {
    onAddDeck: (card: KeyLessDeckCardGeneral) => {
      if (!enabledAddDeck) {
        return;
      }
      if (activeIndex != null) {
        actions.changeDeckGeneral(activeIndex, card);
      } else {
        actions.addDeckGeneral(card);
      }
    },
  };
  return {
    ...sProps,
    ...dProps,
    ...ownProps,
  };
};

export default connect<
  ContainerStateFromProps,
  ContainerDispatchFromProps,
  OwnProps,
  Props
>(mapStateToProps, mapDispatchToProps, mergeProps, {
  areMergedPropsEqual: (nextMergedProps, prevMergedProps) => {
    // 前回・今回共に非表示なら再描画しない
    if (!nextMergedProps.show && !prevMergedProps.show) {
      return true;
    }
    return false;
  },
})(AddButton);
