import type { DeckCard } from '../../modules/deck';

export default function (
  deckCards: DeckCard[],
  generalCardLimit: number,
  activeIndex: number | null = null
): boolean {
  return deckCards.length - (activeIndex != null ? 1 : 0) < generalCardLimit;
}
