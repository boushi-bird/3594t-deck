interface Card {
  readonly fire_date: string;
  readonly gen_main: string;
  readonly gen_sub0: string;
  readonly gen_sub1: string;
  readonly gen_sub2: string;
  readonly get_date: string;
  readonly hire_limit_date: string;
  readonly idx: string;
  readonly number: string;
  readonly pocket: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface MemberData {
  readonly ACTIVE_JEWEL: ReadonlyArray<any>;
  readonly BGM_CARD: ReadonlyArray<any>;
  readonly CARD: ReadonlyArray<Card>;
  readonly DATA: ReadonlyArray<{ readonly code: string }>;
  readonly GENERAL_COUNT: ReadonlyArray<{
    readonly count: string;
    readonly idx: string;
  }>;
  readonly PASSIVE_JEWEL: ReadonlyArray<any>;
  readonly STATUS: ReadonlyArray<any>;
  readonly TACTICS: ReadonlyArray<any>;
}
/* eslint-enable @typescript-eslint/no-explicit-any */
