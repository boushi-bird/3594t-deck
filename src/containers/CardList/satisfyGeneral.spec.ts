import satisfyGeneral from './satisfyGeneral';
import { GeneralImpl } from '../../entities/generalImpl';
import { StrategyImpl } from '../../entities/strategyImpl';
import { initialFilterCondition } from '../../modules/datalist';

const EXAMPLE_GENERAL1 = new GeneralImpl(
  '71',
  {
    code: '4d4d6458fbbe6b4de65cf66fe6defec2',
    pocket_code: '',
    avatar: '8370e17cdd515abe898fdce332061ca7',
    pocket_avatar: '',
    major_version: '2',
    add_version: '1',
    ver_type: '1',
    state: '0',
    rarity: 'R',
    personal: '64',
    cost: '10',
    unit_type: '2',
    general_type: '1',
    buryoku: '2',
    chiryoku: '6',
    seiatsu: '1',
    skill0: '1',
    skill1: '',
    skill2: '',
    gen_main0: '3',
    gen_main1: '2',
    gen_main2: '17',
    strat: '63',
    illustrator: '51',
    voice_actor: '13',
    pocket_off: true,
  },
  {
    majorVersion: 2,
    addVersion: 1,
    isEx: false,
    force: 2,
    intelligence: 6,
    conquest: 1,
    cost: {
      id: '10',
      code: '10',
      name: '1.0',
    },
    genMains: [
      {
        id: '3',
        code: '7cfbeb7b81d1b14e65da41ed58c91216',
        name: '兵力上昇',
        nameShort: '兵力',
        replace: false,
      },
      {
        id: '2',
        code: 'c5ba2908a0a62ad4addf9066a6100604',
        name: '突撃術',
        nameShort: '突撃',
        replace: false,
      },
      {
        id: '17',
        code: '4dfe295dd8c2a8a3d52a6409ee8f4541',
        name: '同盟者',
        nameShort: '同盟',
        replace: false,
      },
    ],
    genMainSp: null,
    generalType: {
      id: '1',
      key: '1',
      code: 'b5acb682650ecae4983f94c19c7e6a79',
      name: 'なし(女性)',
    },
    personal: {
      id: '64',
      name: '夏侯月姫',
      nameRuby: 'かこうげっき',
      azana: '',
      azanaRuby: '',
      uniqueId: '64',
      nameSearchText: {
        text: '夏侯月姫',
        ruby: 'ｶｺｳｹﾂｷ',
      },
      azanaSearchText: {
        text: '',
        ruby: '',
      },
    },
    rarity: {
      id: 'R',
      code: 'R',
      name: 'R',
    },
    skills: [
      {
        id: '1',
        code: 'e9a3c587250741690cc01c89b2fa9f20',
        name: '魅力',
        nameShort: '魅',
      },
    ],
    state: {
      id: '0',
      code: 'c27df45cf8cd8895e643247f78749d47',
      name: '魏',
      nameShort: '魏',
      color: 'rgb(180, 25, 27)',
      thincolor: 'rgba(180, 25, 27, 0.2)',
    },
    unitType: {
      id: '2',
      key: '2',
      code: 'facdd0b9db5c7f823be5b8a1cbfadf6c',
      name: '騎兵',
      nameShort: '騎',
    },
    strategy: new StrategyImpl(
      '63',
      {
        key: '63',
        code: 'db0303d1fecc2fa15ba2b9d1ef05bd4a',
        name: '月光の目覚め',
        name_ruby: 'げっこうのめざめ',
        morale: '4',
        explanation:
          '戦場にいる魏の味方の武力の最大値が大きいほど武力が上がる。一定以上武力が上がると、さらに移動速度と突撃ダメージが上がる',
        strat_category: '0',
        strat_range: '3',
        strat_time: '0',
        name_ruby_search: 'ｹﾂｺｳﾉﾒｻﾒ',
        explanation_search:
          '戦場にいる魏の味方の武力の最大値が大きいほど武力が上がる。一定以上武力が上がると、さらに移動速度と突撃ダメージが上がる',
      },
      {
        code: 'db0303d1fecc2fa15ba2b9d1ef05bd4a',
        name: '月光の目覚め',
        explanation:
          '戦場にいる魏の味方の武力の最大値が大きいほど武力が上がる。一定以上武力が上がると、さらに移動速度と突撃ダメージが上がる',
        morale: 4,
        nameRuby: 'げっこうのめざめ',
        stratCategory: '1',
        stratCategoryName: '強化',
        stratRange: '1',
        stratRangeCode: '5dcd68487fa8097b64a8a0b1e723abd0',
        stratTime: '0',
      }
    ),
  }
);

const EXAMPLE_GENERAL2 = new GeneralImpl(
  '9',
  {
    code: 'b3bf88e47b9790b3617ce4fc903566d9',
    pocket_code: '97c0bf301fec8366690107a6c53a100e',
    avatar: '8b550579c21871e350a6e8fb6781fbd3',
    pocket_avatar: '6074be3ccc492d29df69a36c9561c085',
    major_version: '1',
    add_version: '0',
    ver_type: '1',
    state: '0',
    rarity: 'SR',
    personal: '8',
    cost: '25',
    unit_type: '2',
    general_type: '0',
    buryoku: '8',
    chiryoku: '8',
    seiatsu: '2',
    skill0: '3',
    skill1: '',
    skill2: '',
    gen_main0: '3',
    gen_main1: '2',
    gen_main2: '6',
    strat: '7',
    illustrator: '8',
    voice_actor: '5',
    pocket_off: false,
  },
  {
    majorVersion: 1,
    addVersion: 0,
    isEx: false,
    force: 8,
    intelligence: 8,
    conquest: 2,
    cost: {
      id: '25',
      code: '25',
      name: '2.5',
    },
    genMains: [
      {
        id: '3',
        code: '7cfbeb7b81d1b14e65da41ed58c91216',
        name: '兵力上昇',
        nameShort: '兵力',
        replace: false,
      },
      {
        id: '2',
        code: 'c5ba2908a0a62ad4addf9066a6100604',
        name: '突撃術',
        nameShort: '突撃',
        replace: false,
      },
      {
        id: '6',
        code: '3405cfee88f470ac9ba916064014936d',
        name: '突破術',
        nameShort: '突破',
        replace: false,
      },
    ],
    genMainSp: null,
    generalType: {
      id: '0',
      key: '0',
      code: '6a32328cbdc6507cf12a60c81b7bb9e5',
      name: '武官',
    },
    personal: {
      id: '8',
      name: '夏侯惇',
      nameRuby: 'かこうとん',
      azana: '元譲',
      azanaRuby: 'げんじょう',
      uniqueId: '64',
      nameSearchText: {
        text: '夏侯惇',
        ruby: 'ｶｺｳﾄﾝ',
      },
      azanaSearchText: {
        text: '元譲',
        ruby: 'ｹﾝｼﾖｳ',
      },
    },
    rarity: {
      id: 'SR',
      code: 'SR',
      name: 'SR',
    },
    skills: [
      {
        id: '3',
        code: '89a55f0e40703227723be3b26f94ad65',
        name: '勇猛',
        nameShort: '勇',
      },
    ],
    state: {
      id: '0',
      code: 'c27df45cf8cd8895e643247f78749d47',
      name: '魏',
      nameShort: '魏',
      color: 'rgb(180, 25, 27)',
      thincolor: 'rgba(180, 25, 27, 0.2)',
    },
    unitType: {
      id: '2',
      key: '2',
      code: 'facdd0b9db5c7f823be5b8a1cbfadf6c',
      name: '騎兵',
      nameShort: '騎',
    },
    strategy: new StrategyImpl(
      '7',
      {
        key: '7',
        code: '4dfa19079d8fb8eb92bbc1a5cadeb715',
        name: '隻眼の一喝',
        name_ruby: 'せきがんのいっかつ',
        morale: '5',
        explanation: '敵の武力と移動速度を下げる',
        strat_category: '2',
        strat_range: '1',
        strat_time: '0',
        name_ruby_search: 'ｾｷｶﾝﾉｲﾂｶﾂ',
        explanation_search: '敵の武力と移動速度を下げる',
      },
      {
        code: '4dfa19079d8fb8eb92bbc1a5cadeb715',
        name: '隻眼の一喝',
        explanation: '敵の武力と移動速度を下げる',
        morale: 5,
        nameRuby: 'せきがんのいっかつ',
        stratCategory: '2',
        stratCategoryName: '妨害',
        stratRange: '1',
        stratRangeCode: '6a8be9ce53f700ecbee51f39f5b38501',
        stratTime: '0',
      }
    ),
  }
);

const EXAMPLE_GENERAL3 = new GeneralImpl(
  '9',
  {
    code: '31a035295983e46b30147a7bbb8787b9',
    pocket_code: '',
    avatar: 'a496a6c5793c272d8b42f53613eacc1c',
    pocket_avatar: '',
    major_version: '4',
    add_version: '1',
    ver_type: '1',
    state: '0',
    rarity: 'LE',
    personal: '104',
    cost: '25',
    unit_type: '2',
    general_type: '0',
    buryoku: '8',
    chiryoku: '8',
    seiatsu: '2',
    skill0: '3',
    skill1: '',
    skill2: '',
    gen_main0: '3',
    gen_main1: '2',
    gen_main2: '6',
    strat: '7',
    illustrator: '82',
    voice_actor: '60',
    pocket_off: true,
  },
  {
    majorVersion: 4,
    addVersion: 1,
    isEx: false,
    force: 8,
    intelligence: 8,
    conquest: 2,
    cost: {
      id: '25',
      code: '25',
      name: '2.5',
    },
    genMains: [
      {
        id: '3',
        code: '7cfbeb7b81d1b14e65da41ed58c91216',
        name: '兵力上昇',
        nameShort: '兵力',
        replace: false,
      },
      {
        id: '2',
        code: 'c5ba2908a0a62ad4addf9066a6100604',
        name: '突撃術',
        nameShort: '突撃',
        replace: false,
      },
      {
        id: '6',
        code: '3405cfee88f470ac9ba916064014936d',
        name: '突破術',
        nameShort: '突破',
        replace: false,
      },
    ],
    genMainSp: null,
    generalType: {
      id: '0',
      key: '0',
      code: '6a32328cbdc6507cf12a60c81b7bb9e5',
      name: '武官',
    },
    personal: {
      id: '104',
      name: '夏侯惇',
      nameRuby: 'かこうじゅん',
      azana: '元譲',
      azanaRuby: 'げんじょう',
      uniqueId: '64',
      nameSearchText: {
        text: '夏侯惇',
        ruby: 'ｶｺｳｼﾕﾝ',
      },
      azanaSearchText: {
        text: '元譲',
        ruby: 'ｹﾝｼﾖｳ',
      },
    },
    rarity: {
      id: 'LE',
      code: 'LE',
      name: 'LE',
    },
    skills: [
      {
        id: '3',
        code: '89a55f0e40703227723be3b26f94ad65',
        name: '勇猛',
        nameShort: '勇',
      },
    ],
    state: {
      id: '0',
      code: 'c27df45cf8cd8895e643247f78749d47',
      name: '魏',
      nameShort: '魏',
      color: 'rgb(180, 25, 27)',
      thincolor: 'rgba(180, 25, 27, 0.2)',
    },
    unitType: {
      id: '2',
      key: '2',
      code: 'facdd0b9db5c7f823be5b8a1cbfadf6c',
      name: '騎兵',
      nameShort: '騎',
    },
    strategy: new StrategyImpl(
      '7',
      {
        key: '7',
        code: '4dfa19079d8fb8eb92bbc1a5cadeb715',
        name: '隻眼の一喝',
        name_ruby: 'せきがんのいっかつ',
        morale: '5',
        explanation: '敵の武力と移動速度を下げる',
        strat_category: '2',
        strat_range: '1',
        strat_time: '0',
        name_ruby_search: 'ｾｷｶﾝﾉｲﾂｶﾂ',
        explanation_search: '敵の武力と移動速度を下げる',
      },
      {
        code: '4dfa19079d8fb8eb92bbc1a5cadeb715',
        name: '隻眼の一喝',
        explanation: '敵の武力と移動速度を下げる',
        morale: 5,
        nameRuby: 'せきがんのいっかつ',
        stratCategory: '2',
        stratCategoryName: '妨害',
        stratRange: '1',
        stratRangeCode: '6a8be9ce53f700ecbee51f39f5b38501',
        stratTime: '0',
      }
    ),
  }
);

const DEFAULT_FILTER = initialFilterCondition;

describe('Filter General', () => {
  describe('filter by name', () => {
    it('武将名検索 濁点付き読み仮名で一致', () => {
      expect(
        satisfyGeneral(EXAMPLE_GENERAL1, {
          ...DEFAULT_FILTER,
          basic: {
            ...DEFAULT_FILTER.basic,
            searchText: 'かこうげっき',
          },
        })
      ).toBe(true);
      expect(
        satisfyGeneral(EXAMPLE_GENERAL3, {
          ...DEFAULT_FILTER,
          basic: {
            ...DEFAULT_FILTER.basic,
            searchText: 'かこうじゅん',
          },
        })
      ).toBe(true);
    });
    it('武将名検索 漢字で一致', () => {
      expect(
        satisfyGeneral(EXAMPLE_GENERAL1, {
          ...DEFAULT_FILTER,
          basic: {
            ...DEFAULT_FILTER.basic,
            searchText: '夏侯月姫',
          },
        })
      ).toBe(true);
      expect(
        satisfyGeneral(EXAMPLE_GENERAL2, {
          ...DEFAULT_FILTER,
          basic: {
            ...DEFAULT_FILTER.basic,
            searchText: '夏侯惇',
          },
        })
      ).toBe(true);
      expect(
        satisfyGeneral(EXAMPLE_GENERAL3, {
          ...DEFAULT_FILTER,
          basic: {
            ...DEFAULT_FILTER.basic,
            searchText: '夏侯惇',
          },
        })
      ).toBe(true);
    });
    it('武将名検索 濁点なし読み仮名で一致', () => {
      expect(
        satisfyGeneral(EXAMPLE_GENERAL1, {
          ...DEFAULT_FILTER,
          basic: {
            ...DEFAULT_FILTER.basic,
            searchText: 'かこうけつき',
          },
        })
      ).toBe(true);
      expect(
        satisfyGeneral(EXAMPLE_GENERAL2, {
          ...DEFAULT_FILTER,
          basic: {
            ...DEFAULT_FILTER.basic,
            searchText: 'かこうとん',
          },
        })
      ).toBe(true);
      expect(
        satisfyGeneral(EXAMPLE_GENERAL3, {
          ...DEFAULT_FILTER,
          basic: {
            ...DEFAULT_FILTER.basic,
            searchText: 'かこうしゅん',
          },
        })
      ).toBe(true);
    });
    it('武将名検索 不一致', () => {
      expect(
        satisfyGeneral(EXAMPLE_GENERAL1, {
          ...DEFAULT_FILTER,
          basic: {
            ...DEFAULT_FILTER.basic,
            searchText: 'かこうとん',
          },
        })
      ).toBe(false);
      expect(
        satisfyGeneral(EXAMPLE_GENERAL2, {
          ...DEFAULT_FILTER,
          basic: {
            ...DEFAULT_FILTER.basic,
            searchText: 'かこうげっき',
          },
        })
      ).toBe(false);
      expect(
        satisfyGeneral(EXAMPLE_GENERAL3, {
          ...DEFAULT_FILTER,
          basic: {
            ...DEFAULT_FILTER.basic,
            searchText: 'かこうげっき',
          },
        })
      ).toBe(false);
    });
  });
});
