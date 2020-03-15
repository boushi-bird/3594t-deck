import { MAX_DECK_CARD_COUNT } from '../../modules/deck/reducer';
import { DeckCard } from '../../modules/deck/query';

export default function(
  deckCards: DeckCard[],
  activeIndex: number | null = null
): boolean {
  return deckCards.length - (activeIndex != null ? 1 : 0) < MAX_DECK_CARD_COUNT;
}
