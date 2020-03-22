import { MAX_DECK_GENERAL_CARD_COUNT } from '../../const';
import { DeckCard } from '../../modules/deck';

export default function(
  deckCards: DeckCard[],
  activeIndex: number | null = null
): boolean {
  return (
    deckCards.length - (activeIndex != null ? 1 : 0) <
    MAX_DECK_GENERAL_CARD_COUNT
  );
}
