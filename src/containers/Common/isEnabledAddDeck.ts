import { DeckCard, MAX_DECK_CARD_COUNT } from '../../modules/deck';

export default function(deckCards: DeckCard[], activeIndex?: number): boolean {
  return deckCards.length - (activeIndex != null ? 1 : 0) < MAX_DECK_CARD_COUNT;
}
