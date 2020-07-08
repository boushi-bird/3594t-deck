import { RawStrategy, SearchText } from '3594t-deck';

interface Props {
  readonly code: string;
  readonly explanation: string;
  readonly morale: number;
  readonly name: string;
  readonly nameRuby: string;
  readonly stratCategory: string;
  readonly stratCategoryName: string;
  readonly stratRange: string;
  readonly stratRangeCode: string;
  readonly stratTime: string;
}

export class StrategyImpl implements Props {
  public readonly code: string;
  public readonly explanation: string;
  public readonly morale: number;
  public readonly name: string;
  public readonly nameRuby: string;
  public readonly stratCategory: string;
  public readonly stratCategoryName: string;
  public readonly stratRange: string;
  public readonly stratRangeCode: string;
  public readonly stratTime: string;

  public constructor(
    public readonly id: string,
    public readonly raw: RawStrategy,
    props: Props
  ) {
    Object.assign(this, props);
  }

  public get rawExplanation(): string {
    return this.raw.explanation;
  }
  public get nameSearchText(): SearchText {
    return {
      text: this.raw.name,
      ruby: this.raw.name_ruby_search,
    };
  }
}
