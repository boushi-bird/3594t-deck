import { SearchMode } from '3594t-deck';
import satisfyGeneral from './satisfyGeneral';
import { GeneralImpl } from '../../entities/generalImpl';

const EXAMPLE_GENERAL = new GeneralImpl(
  '71',
  {
    /* eslint-disable @typescript-eslint/camelcase */
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
    /* eslint-enable @typescript-eslint/camelcase */
  },
  {
    majorVersion: 2,
    addVersion: 1,
    isEx: false,
    force: 2,
    intelligence: 6,
    conquest: 1,
    cost: {
      // id: '10',
      code: '10',
      name: '1.0',
    },
    genMains: [
      {
        id: '3',
        code: '7cfbeb7b81d1b14e65da41ed58c91216',
        name: '兵力上昇',
        nameShort: '兵力',
      },
      {
        id: '2',
        code: 'c5ba2908a0a62ad4addf9066a6100604',
        name: '突撃術',
        nameShort: '突撃',
      },
      {
        id: '17',
        code: '4dfe295dd8c2a8a3d52a6409ee8f4541',
        name: '同盟者',
        nameShort: '同盟',
      },
    ],
    generalType: {
      // id: '1',
      code: 'b5acb682650ecae4983f94c19c7e6a79',
      name: 'なし(女性)',
    },
    personal: {
      name: '夏侯月姫',
      name_ruby: 'ｶｺｳｹﾂｷ', // eslint-disable-line @typescript-eslint/camelcase
      azana: '',
      azana_ruby: '', // eslint-disable-line @typescript-eslint/camelcase
    },
    rarity: {
      // id: 'R',
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
      // id: '0',
      code: 'c27df45cf8cd8895e643247f78749d47',
      name: '魏',
      nameShort: '魏',
      color: 'rgb(180, 25, 27)',
      thincolor: 'rgba(180, 25, 27, 0.2)',
    },
    unitType: {
      // id: '2',
      code: 'facdd0b9db5c7f823be5b8a1cbfadf6c',
      name: '騎兵',
      nameShort: '騎',
    },
    strategy: {
      id: '63',
      // key: '63',
      code: 'db0303d1fecc2fa15ba2b9d1ef05bd4a',
      name: '月光の目覚め',
      explanation:
        '戦場にいる魏の味方の武力の最大値が大きいほど武力が上がる。一定以上武力が上がると、さらに移動速度と突撃ダメージが上がる',
      rawExplanation:
        '戦場にいる魏の味方の武力の最大値が大きいほど武力が上がる。一定以上武力が上がると、さらに移動速度と突撃ダメージが上がる',
      morale: 4,
      nameRuby: 'ｹﾂｺｳﾉﾒｻﾒ',
      stratCategory: '1',
      stratCategoryName: '強化',
      stratRange: '1',
      stratRangeCode: '5dcd68487fa8097b64a8a0b1e723abd0',
      stratTime: '0',
    },
  }
);

const searchMode: SearchMode = 'general';

const DEFAULT_FILTER = {
  basic: {
    searchMode,
    belongStates: [],
    costs: [],
    unitTypes: [],
    forceMin: 1,
    forceMax: 10,
    useCostRatioForce: false,
    costRatioForceMin: -4,
    costRatioForceMax: 5,
    costRatioBaseForces: { '10': 3, '15': 6, '20': 8, '25': 9, '30': 10 },
    intelligenceMin: 1,
    intelligenceMax: 10,
    conquestMin: 0,
    conquestMax: 4,
    skills: [],
    skillsAnd: false,
    searchText: '',
  },
  detail: {
    genMains: [],
    genMainsAnd: false,
    rarities: [],
    generalTypes: [],
    varTypes: [],
    majorVersions: [],
    versions: [],
    enableDetailVersion: false,
    pockets: [],
  },
  strategies: {
    showStrategyExplanation: false,
    moraleMin: 1,
    moraleMax: 12,
    strategyCategories: [],
    strategyRanges: [],
    strategyTimes: [],
    strategySearchName: '',
    strategySearchExplanation: '',
  },
};

test('filter by name', () => {
  const general = EXAMPLE_GENERAL;
  expect(
    satisfyGeneral(general, {
      ...DEFAULT_FILTER,
      basic: {
        ...DEFAULT_FILTER.basic,
        searchText: 'かこうげっき',
      },
    })
  ).toBe(true);
  expect(
    satisfyGeneral(general, {
      ...DEFAULT_FILTER,
      basic: {
        ...DEFAULT_FILTER.basic,
        searchText: '夏侯月姫',
      },
    })
  ).toBe(true);
  expect(
    satisfyGeneral(general, {
      ...DEFAULT_FILTER,
      basic: {
        ...DEFAULT_FILTER.basic,
        searchText: 'かこうけつき',
      },
    })
  ).toBe(true);
  expect(
    satisfyGeneral(general, {
      ...DEFAULT_FILTER,
      basic: {
        ...DEFAULT_FILTER.basic,
        searchText: 'かこうとん',
      },
    })
  ).toBe(false);
});
