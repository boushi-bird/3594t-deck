import { RawStrategy, Strategy } from '3594t-deck';

interface Props {
  readonly explanation: string;
  readonly stratCategory: string;
  readonly stratCategoryName: string;
  readonly stratRange: string;
  readonly stratRangeCode: string;
}

export default function (id: string, raw: RawStrategy, props: Props): Strategy {
  return {
    id,
    morale: parseInt(raw.morale),
    code: raw.code,
    name: raw.name,
    nameRuby: raw.name_ruby,
    stratTime: raw.strat_time,
    rawExplanation: raw.explanation,
    nameSearchText: {
      text: raw.name,
      ruby: raw.name_ruby_search,
    },
    ...props,
  };
}
