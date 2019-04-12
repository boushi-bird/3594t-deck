interface Enishi {
  readonly fire_10t: string;
  readonly hire: string;
  readonly rarity: string;
}

interface ExRank {
  readonly code: string;
  readonly count: string;
  readonly key: string;
  readonly name: string;
}

interface General {
  readonly add_version: string;
  readonly belong: number;
  readonly buryoku: string;
  readonly chiryoku: string;
  readonly code: string;
  readonly cost: string;
  readonly ex_rank: string;
  readonly gen_main0: string;
  readonly gen_main1: string;
  readonly gen_main2: string;
  readonly general_type: string;
  readonly illustrator: string;
  readonly major_version: string;
  readonly not_belong: boolean;
  readonly personal: string;
  readonly pocket_code: string;
  readonly rarity: string;
  readonly seiatsu: string;
  readonly skill0: string;
  readonly skill1: string;
  readonly skill2: string;
  readonly state: string;
  readonly strat: string;
  readonly unit_type: string;
  readonly ver_type: string;
  readonly voice_actor: string;
}

interface GeneralType {
  readonly code: string;
  readonly key: string;
  readonly name: string;
}

interface GenMain {
  readonly code: string;
  readonly key: string;
  readonly name: string;
  readonly name_short: string;
}

interface GenSub {
  readonly code: string;
  readonly name: string;
  readonly name_short: string;
}

interface Illustrator {
  readonly idx: string;
  readonly name: string;
}

interface Personal {
  readonly azana: string;
  readonly azana_ruby: string;
  readonly name: string;
  readonly name_ruby: string;
}

interface Skill {
  readonly code: string;
  readonly key: string;
  readonly name: string;
  readonly short_name: string;
}

interface State {
  readonly blue: string;
  readonly code: string;
  readonly green: string;
  readonly name: string;
  readonly name_short: string;
  readonly red: string;
}

interface Strat {
  readonly code: string;
  readonly explanation: string;
  readonly key: string;
  readonly morale: string;
  readonly name: string;
  readonly name_ruby: string;
  readonly strat_category: string;
  readonly strat_range: string;
  readonly strat_time: string;
}

interface StratCategory {
  readonly code: string;
  readonly key: string;
  readonly name: string;
}

interface StratRange {
  readonly code: string;
}

interface StratTime {
  readonly name: string;
}

interface UnitType {
  readonly code: string;
  readonly key: string;
  readonly name: string;
}

interface VerType {
  readonly name: string;
}

interface VoiceActor {
  readonly idx: string;
  readonly name: string;
}

export interface BaseData {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  readonly ACTIVE_JEWEL: ReadonlyArray<any>;
  readonly ACTIVE_JEWEL_TYPE: ReadonlyArray<any>;
  readonly BGM: ReadonlyArray<any>;
  /* eslint-enable @typescript-eslint/no-explicit-any */
  readonly COST: {
    readonly [key: number]: { readonly code: string; readonly name: string };
  };
  readonly DATA: ReadonlyArray<{ code: string }>;
  readonly ENISHI: ReadonlyArray<Enishi>;
  readonly EXT: ReadonlyArray<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  readonly EX_RANK: ReadonlyArray<ExRank>;
  readonly GENERAL: ReadonlyArray<General>;
  readonly GENERAL_TYPE: ReadonlyArray<GeneralType>;
  readonly GEN_MAIN: ReadonlyArray<GenMain>;
  readonly GEN_SUB: ReadonlyArray<GenSub>;
  readonly ILLUSTRATOR: ReadonlyArray<Illustrator>;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  readonly PARAM: ReadonlyArray<any>;
  readonly PASSIVE_JEWEL: ReadonlyArray<any>;
  readonly PATH: ReadonlyArray<any>;
  /* eslint-enable @typescript-eslint/no-explicit-any */
  readonly PERSONAL: ReadonlyArray<Personal>;
  readonly RARITY: {
    readonly [key: string]: { readonly code: string; readonly name: string };
  };
  readonly SKILL: ReadonlyArray<Skill>;
  readonly STATE: ReadonlyArray<State>;
  readonly STRAT: ReadonlyArray<Strat>;
  readonly STRAT_CATEGORY: ReadonlyArray<StratCategory>;
  readonly STRAT_RANGE: ReadonlyArray<StratRange>;
  readonly STRAT_TIME: ReadonlyArray<StratTime>;
  readonly TACTICS: ReadonlyArray<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  readonly UNIT_TYPE: ReadonlyArray<UnitType>;
  readonly VER_TYPE: ReadonlyArray<VerType>;
  readonly VOICE_ACTOR: ReadonlyArray<VoiceActor>;
}
