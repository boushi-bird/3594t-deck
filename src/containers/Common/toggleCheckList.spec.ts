import 'jest-extended';
import { FilterContents } from '3594t-deck';
import type {
  BasicFilterCondition,
  DetailFilterCondition,
} from '../../modules/datalist';
import { toggleBasicCheckList, toggleDetailCheckList } from './toggleCheckList';
import {
  MIN_FORCE,
  MAX_FORCE,
  MIN_INTELIGENCE,
  MAX_INTELIGENCE,
  MIN_CONQUEST,
  MAX_CONQUEST,
} from '../../const';

const testFilterContents: FilterContents = {
  belongStates: [],
  costs: [],
  unitTypes: [],
  skills: [],
  genMains: [],
  rarities: [],
  generalTypes: [],
  varTypes: [],
  versions: [
    [
      { id: '1-0', name: '第1弾' },
      { id: '1-1', name: '第1弾-1' },
      { id: '1-2', name: '第1弾-2' },
      { id: '1-3', name: '第1弾-3' },
      { id: '1-4', name: '第1弾-4' },
      { id: '1-5', name: '第1弾-5' },
      { id: '1-EX', name: '第1弾-EX' },
    ],
    [
      { id: '2-0', name: '第2弾' },
      { id: '2-1', name: '第2弾-1' },
      { id: '2-EX', name: '第2弾-EX' },
    ],
    [
      { id: '3-0', name: '第3弾' },
      { id: '3-1', name: '第3弾-1' },
      { id: '3-2', name: '第3弾-2' },
      { id: '3-EX', name: '第3弾-EX' },
    ],
    [
      { id: '4-0', name: '第4弾' },
      { id: '4-1', name: '第4弾-1' },
      { id: '4-2', name: '第4弾-2' },
      { id: '4-3', name: '第4弾-3' },
      { id: '4-EX', name: '第4弾-EX' },
    ],
  ],
  majorVersions: [
    {
      id: '1',
      name: '第1段',
    },
    {
      id: '2',
      name: '第2段',
    },
    {
      id: '3',
      name: '第3段',
    },
    {
      id: '4',
      name: '第4段',
    },
  ],
  strategyCategories: [],
  strategyRanges: [],
  strategyTimes: [],
  assistStrategyCategories: [],
};

const testBasicFilterCondition: BasicFilterCondition = {
  belongStates: [],
  costs: [],
  unitTypes: [],
  forceMin: MIN_FORCE,
  forceMax: MAX_FORCE,
  useCostRatioForce: false,
  costRatioForceMin: -4,
  costRatioForceMax: 5,
  costRatioBaseForces: {
    '10': 3,
    '15': 6,
    '20': 8,
    '25': 9,
    '30': 10,
  },
  intelligenceMin: MIN_INTELIGENCE,
  intelligenceMax: MAX_INTELIGENCE,
  conquestMin: MIN_CONQUEST,
  conquestMax: MAX_CONQUEST,
  skills: [],
  skillsAnd: false,
  searchText: '',
};

const testDetailFilterCondition: DetailFilterCondition = {
  genMains: [],
  genMainsAnd: false,
  rarities: [],
  generalTypes: [],
  varTypes: [],
  majorVersions: [],
  versions: [],
  enableDetailVersion: false,
  pockets: [],
};

describe('Toggle BasicFilter checklist', () => {
  describe('belongStates', () => {
    it('multiple, 既存選択なし belongStatesに追加', () => {
      expect(
        toggleBasicCheckList(
          'multiple',
          {
            ...testBasicFilterCondition,
            belongStates: [],
          },
          'belongStates',
          '2'
        )
      ).toHaveProperty('belongStates', expect.toIncludeSameMembers(['2']));
    });

    it('multiple, 既存選択あり belongStatesに追加', () => {
      expect(
        toggleBasicCheckList(
          'multiple',
          {
            ...testBasicFilterCondition,
            belongStates: ['1', '3'],
          },
          'belongStates',
          '2'
        )
      ).toHaveProperty(
        'belongStates',
        expect.toIncludeSameMembers(['1', '2', '3'])
      );
    });

    it('multiple, belongStatesから削除', () => {
      expect(
        toggleBasicCheckList(
          'multiple',
          {
            ...testBasicFilterCondition,
            belongStates: ['3', '4', '5'],
          },
          'belongStates',
          '4'
        )
      ).toHaveProperty('belongStates', expect.toIncludeSameMembers(['3', '5']));
    });

    it('singular, 既存選択なし belongStatesに追加', () => {
      expect(
        toggleBasicCheckList(
          'singular',
          {
            ...testBasicFilterCondition,
            belongStates: [],
          },
          'belongStates',
          '2'
        )
      ).toHaveProperty('belongStates', expect.toIncludeSameMembers(['2']));
    });

    it('singular, 既存選択あり 選択したbelongStatesのみに', () => {
      expect(
        toggleBasicCheckList(
          'singular',
          {
            ...testBasicFilterCondition,
            belongStates: ['1', '3'],
          },
          'belongStates',
          '2'
        )
      ).toHaveProperty('belongStates', expect.toIncludeSameMembers(['2']));
    });

    it('singular, 既存選択あり 選択したbelongStatesが削除', () => {
      expect(
        toggleBasicCheckList(
          'singular',
          {
            ...testBasicFilterCondition,
            belongStates: ['3', '4', '5'],
          },
          'belongStates',
          '4'
        )
      ).toHaveProperty('belongStates', expect.toIncludeSameMembers(['3', '5']));
    });
  });
});

describe('Toggle DetailFilter checklist', () => {
  describe('rarities', () => {
    it('multiple, 既存選択なし raritiesに追加', () => {
      expect(
        toggleDetailCheckList(
          'multiple',
          {
            filterContents: testFilterContents,
            filterCondition: {
              ...testDetailFilterCondition,
              rarities: [],
            },
          },
          'rarities',
          'UC'
        )
      ).toHaveProperty('rarities', expect.toIncludeSameMembers(['UC']));
    });
  });

  describe('majorVersions', () => {
    it('multiple, 既存選択あり majorVersionsに追加 更にversionsも追加', () => {
      expect(
        toggleDetailCheckList(
          'multiple',
          {
            filterContents: testFilterContents,
            filterCondition: {
              ...testDetailFilterCondition,
              majorVersions: ['2'],
              versions: ['2-1'],
            },
          },
          'majorVersions',
          '1'
        )
      ).toContainEntries([
        ['majorVersions', expect.toIncludeSameMembers(['1', '2'])],
        [
          'versions',
          expect.toIncludeSameMembers([
            '1-0',
            '1-1',
            '1-2',
            '1-3',
            '1-4',
            '1-5',
            '1-EX',
            '2-1',
          ]),
        ],
      ]);
    });

    it('multiple, 既存選択あり 選択したmajorVersions削除 更にversionsも削除', () => {
      expect(
        toggleDetailCheckList(
          'multiple',
          {
            filterContents: testFilterContents,
            filterCondition: {
              ...testDetailFilterCondition,
              majorVersions: ['1', '2'],
              versions: ['1-0', '1-1', '1-2', '2-1', '2-EX'],
            },
          },
          'majorVersions',
          '2'
        )
      ).toContainEntries([
        ['majorVersions', expect.toIncludeSameMembers(['1'])],
        ['versions', expect.toIncludeSameMembers(['1-0', '1-1', '1-2'])],
      ]);
    });

    it('singular, 既存選択あり 選択したmajorVersionsのみに 更にversionsも選択変更', () => {
      expect(
        toggleDetailCheckList(
          'singular',
          {
            filterContents: testFilterContents,
            filterCondition: {
              ...testDetailFilterCondition,
              majorVersions: ['2'],
              versions: ['2-1'],
            },
          },
          'majorVersions',
          '1'
        )
      ).toContainEntries([
        ['majorVersions', expect.toIncludeSameMembers(['1'])],
        [
          'versions',
          expect.toIncludeSameMembers([
            '1-0',
            '1-1',
            '1-2',
            '1-3',
            '1-4',
            '1-5',
            '1-EX',
          ]),
        ],
      ]);
    });

    it('singular, 選択したmajorVersions削除 更にversionsも削除', () => {
      expect(
        toggleDetailCheckList(
          'singular',
          {
            filterContents: testFilterContents,
            filterCondition: {
              ...testDetailFilterCondition,
              majorVersions: ['1', '2'],
              versions: ['1-0', '1-1', '1-2', '2-1', '2-EX'],
            },
          },
          'majorVersions',
          '2'
        )
      ).toContainEntries([
        ['majorVersions', expect.toIncludeSameMembers(['1'])],
        ['versions', expect.toIncludeSameMembers(['1-0', '1-1', '1-2'])],
      ]);
    });
  });

  describe('versions', () => {
    it('multiple, 既存選択あり versionsに追加 更にmajorVersionsも追加', () => {
      expect(
        toggleDetailCheckList(
          'multiple',
          {
            filterContents: testFilterContents,
            filterCondition: {
              ...testDetailFilterCondition,
              majorVersions: ['2'],
              versions: ['2-0', '2-1'],
            },
          },
          'versions',
          '1-1'
        )
      ).toContainEntries([
        ['majorVersions', expect.toIncludeSameMembers(['1', '2'])],
        ['versions', expect.toIncludeSameMembers(['1-1', '2-0', '2-1'])],
      ]);
    });

    it('multiple, versions削除 該当するversionsが他に残っていればmajorVersionsを削除しない', () => {
      expect(
        toggleDetailCheckList(
          'multiple',
          {
            filterContents: testFilterContents,
            filterCondition: {
              ...testDetailFilterCondition,
              majorVersions: ['1', '2'],
              versions: ['1-0', '1-1', '1-2', '2-1', '2-EX'],
            },
          },
          'versions',
          '2-1'
        )
      ).toContainEntries([
        ['majorVersions', expect.toIncludeSameMembers(['1', '2'])],
        [
          'versions',
          expect.toIncludeSameMembers(['1-0', '1-1', '1-2', '2-EX']),
        ],
      ]);
    });

    it('multiple, versions削除 該当するversionsが他に残っていなければmajorVersionsを削除する', () => {
      expect(
        toggleDetailCheckList(
          'multiple',
          {
            filterContents: testFilterContents,
            filterCondition: {
              ...testDetailFilterCondition,
              majorVersions: ['1', '2', '3'],
              versions: ['1-0', '1-1', '1-2', '2-1', '2-EX', '3-1'],
            },
          },
          'versions',
          '3-1'
        )
      ).toContainEntries([
        ['majorVersions', expect.toIncludeSameMembers(['1', '2'])],
        [
          'versions',
          expect.toIncludeSameMembers(['1-0', '1-1', '1-2', '2-1', '2-EX']),
        ],
      ]);
    });
  });

  it('singular, 既存選択あり versions変更 更にmajorVersionsも変更', () => {
    expect(
      toggleDetailCheckList(
        'singular',
        {
          filterContents: testFilterContents,
          filterCondition: {
            ...testDetailFilterCondition,
            majorVersions: ['2'],
            versions: ['2-0', '2-1'],
          },
        },
        'versions',
        '1-1'
      )
    ).toContainEntries([
      ['majorVersions', expect.toIncludeSameMembers(['1'])],
      ['versions', expect.toIncludeSameMembers(['1-1'])],
    ]);
  });

  it('singular, 既存選択あり versions変更 更にmajorVersionsも変更', () => {
    expect(
      toggleDetailCheckList(
        'singular',
        {
          filterContents: testFilterContents,
          filterCondition: {
            ...testDetailFilterCondition,
            majorVersions: ['1', '2'],
            versions: ['1-0', '2-0', '2-1'],
          },
        },
        'versions',
        '1-1'
      )
    ).toContainEntries([
      ['majorVersions', expect.toIncludeSameMembers(['1'])],
      ['versions', expect.toIncludeSameMembers(['1-1'])],
    ]);
  });

  it('singular, versions削除 該当するversionsが他に残っていればmajorVersionsを削除しない', () => {
    expect(
      toggleDetailCheckList(
        'singular',
        {
          filterContents: testFilterContents,
          filterCondition: {
            ...testDetailFilterCondition,
            majorVersions: ['1', '2'],
            versions: ['1-0', '1-1', '1-2', '2-1', '2-EX'],
          },
        },
        'versions',
        '2-1'
      )
    ).toContainEntries([
      ['majorVersions', expect.toIncludeSameMembers(['1', '2'])],
      ['versions', expect.toIncludeSameMembers(['1-0', '1-1', '1-2', '2-EX'])],
    ]);
  });

  it('singular, versions削除 該当するversionsが他に残っていなければmajorVersionsを削除する', () => {
    expect(
      toggleDetailCheckList(
        'singular',
        {
          filterContents: testFilterContents,
          filterCondition: {
            ...testDetailFilterCondition,
            majorVersions: ['1', '2', '3'],
            versions: ['1-0', '1-1', '1-2', '2-1', '2-EX', '3-1'],
          },
        },
        'versions',
        '3-1'
      )
    ).toContainEntries([
      ['majorVersions', expect.toIncludeSameMembers(['1', '2'])],
      [
        'versions',
        expect.toIncludeSameMembers(['1-0', '1-1', '1-2', '2-1', '2-EX']),
      ],
    ]);
  });
});
