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
  DeckCard,
  DeckCardAssist,
  SameCardConstraint,
} from '../../modules/deck';
import { deckActions } from '../../modules/deck';

interface StateFromProps {
  enabledAddDeck: boolean;
}

type DispatchFromProps = {
  onAddDeck: (card: DeckCardAssist) => void;
};

interface OwnProps {
  assist: AssistGeneral;
  show?: boolean;
}

type Props = StateFromProps & DispatchFromProps & OwnProps;

class AddButton extends React.PureComponent<Props> {
  private handleAddDeckClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    const { assist, onAddDeck } = this.props;
    event.stopPropagation();
    onAddDeck({
      assist: assist.id,
    });
  };

  public render(): React.ReactNode {
    const { enabledAddDeck } = this.props;
    return (
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
  addDeckAssist: (card: DeckCardAssist) => void;
  changeDeckAssist: (index: number, card: DeckCardAssist) => void;
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
  generals: state.datalistReducer.generals,
  assistGenerals: state.datalistReducer.assistGenerals,
  deckCards: state.deckReducer.deckCards,
  assistDeckCards: state.deckReducer.assistDeckCards,
  assistCardLimit: state.deckReducer.deckConstraints.assistCardLimit,
  activeIndex: state.deckReducer.activeIndex,
  activeAssistIndex: state.deckReducer.activeAssistIndex,
  sameCard: state.deckReducer.deckConstraints.sameCard,
});

const mapDispatchToProps: TMapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      addDeckAssist: deckActions.addDeckAssist,
      changeDeckAssist: deckActions.changeDeckAssist,
    },
    dispatch
  );
};

// デッキに含まれている武将名IDの配列を返す
function createDeckPersonals(
  state: ContainerStateFromProps,
  deckCards: DeckCard[]
): string[] {
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
    .map((g) => g.raw.personal);
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
    .map((ag) => ag.raw.personal);
}

function isEnabledAddDeck(
  assistDeckCards: DeckCardAssist[],
  assistCardLimit: number,
  activeAssistIndex: number | null = null
): boolean {
  if (assistCardLimit === 0) {
    return false;
  }
  if (activeAssistIndex !== null) {
    return true;
  }
  const deckAssists: string[] = assistDeckCards
    .filter((ad, i) => i < assistCardLimit)
    .map((ad) => ad.assist);
  return deckAssists.length < assistCardLimit;
}

function isEnabledAddDeckAssist(
  assist: AssistGeneral,
  deckPersonals: string[],
  deckAssistPersonals: string[],
  sameCard: SameCardConstraint
): boolean {
  // 遊軍の同名カード判別
  // TODO: 複数枚遊軍登録可能になり、さらに同名遊軍が登場した場合は要対応
  const hasSameCard = deckAssistPersonals.some(
    (p) => p === assist.raw.personal
  );
  if (hasSameCard) {
    return false;
  }

  if (sameCard === 'personal-strategy' || sameCard === 'personal-assist') {
    return true;
  }
  // 武将カードに同名カードがあるか判別する
  return !deckPersonals.some((p) => p === assist.raw.personal);
}

const mergeProps: TMergeProps = (state, actions, ownProps) => {
  const {
    deckCards,
    assistDeckCards,
    activeIndex,
    activeAssistIndex,
    sameCard,
    assistCardLimit,
  } = state;
  const { assist } = ownProps;
  const deckPersonals = createDeckPersonals(state, deckCards);
  const deckAssistPersonals = createAssistDeckPersonals(state, assistDeckCards);
  const enabledAddDeck =
    activeIndex == null &&
    isEnabledAddDeck(assistDeckCards, assistCardLimit, activeAssistIndex) &&
    isEnabledAddDeckAssist(
      assist,
      deckPersonals,
      deckAssistPersonals,
      sameCard
    );
  const sProps: StateFromProps = {
    enabledAddDeck,
  };
  const dProps: DispatchFromProps = {
    onAddDeck: (card: DeckCardAssist) => {
      if (!enabledAddDeck) {
        return;
      }
      if (
        activeAssistIndex != null &&
        assistDeckCards.length > activeAssistIndex
      ) {
        actions.changeDeckAssist(activeAssistIndex, card);
      } else {
        actions.addDeckAssist(card);
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
