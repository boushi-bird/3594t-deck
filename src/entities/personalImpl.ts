import { Personal, RawPersonal, SearchText } from '3594t-deck';

export class PersonalImpl implements Personal {
  public readonly azana: string;
  public readonly azanaRuby: string;
  public readonly name: string;
  public readonly nameRuby: string;
  public readonly uniqueId: string;

  public constructor(
    public readonly id: string,
    private readonly raw: RawPersonal,
    personal: Personal | undefined = undefined
  ) {
    this.azana = raw.azana;
    this.azanaRuby = raw.azana_ruby.replace(/＿/g, '');
    this.name = raw.name;
    this.nameRuby = raw.name_ruby.replace(/＿/g, '');
    this.uniqueId = personal?.id || id;
  }

  public get azanaSearchText(): SearchText {
    return {
      text: this.azana,
      ruby: this.raw.azana_ruby_search,
    };
  }

  public get nameSearchText(): SearchText {
    return {
      text: this.name,
      ruby: this.raw.name_ruby_search,
    };
  }
}
