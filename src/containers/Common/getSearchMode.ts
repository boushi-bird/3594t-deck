import { SearchMode } from '3594t-deck';

export default function (
  deck: {
    activeIndex: number | null;
    activeAssistIndex: number | null;
  },
  filterCondition: { searchMode: SearchMode }
): SearchMode {
  return deck.activeIndex != null
    ? 'general'
    : deck.activeAssistIndex != null
    ? 'assist'
    : filterCondition.searchMode;
}
