// デモ用データ（施設名・人物はすべて架空です）
export const DEMO_TODAY = '2026-10-15';

export const CARE_LEVELS = ['要支援1', '要支援2', '要介護1', '要介護2', '要介護3', '要介護4', '要介護5'];
export const AREAS = ['世田谷区', '杉並区', '練馬区', '板橋区', '足立区', '江戸川区', '八王子市', '町田市'];
export const TYPES = ['特別養護老人ホーム', '介護付き有料老人ホーム', '住宅型有料老人ホーム', 'サービス付き高齢者向け住宅', 'グループホーム', '介護老人保健施設'];
export const TYPE_SHORT = {
  '特別養護老人ホーム': '特養',
  '介護付き有料老人ホーム': '介護付有料',
  '住宅型有料老人ホーム': '住宅型有料',
  'サービス付き高齢者向け住宅': 'サ高住',
  'グループホーム': 'GH',
  '介護老人保健施設': '老健'
};
export const MEDICAL = ['喀痰吸引', '胃ろう', 'インスリン', '在宅酸素', '人工透析', '看取り'];
export const STATUSES = ['相談受付', '候補提示', '見学調整', '入居決定', '保留'];

export const USERS = [
  { id: 'admin', name: '山本 恵', role: 'admin', label: '管理者' },
  { id: 'sato', name: '佐藤 美咲', role: 'staff', label: '相談員' },
  { id: 'suzuki', name: '鈴木 健太', role: 'staff', label: '相談員' },
  { id: 'fac-F01', name: 'ひだまりの郷 担当', role: 'facility', label: '施設担当者', facilityId: 'F01' }
];

const lv = (from, to) => CARE_LEVELS.slice(CARE_LEVELS.indexOf(from), CARE_LEVELS.indexOf(to) + 1);

export const defaultFacilities = [
  { id: 'F01', name: 'ひだまりの郷 世田谷', type: '介護付き有料老人ホーム', area: '世田谷区', address: '東京都世田谷区桜丘3-12-5', tel: '03-5000-1201', careLevels: lv('要支援1', '要介護5'), monthly: 228000, entryFee: 0, welfare: false, dementia: true, medical: ['喀痰吸引', 'インスリン', '在宅酸素', '看取り'], rooms: 60, vacancy: 3, updatedAt: '2026-10-14', features: ['24時間看護師常駐', '個室トイレ', '駅徒歩8分'], hue: 168 },
  { id: 'F02', name: 'さくら苑 杉並', type: '特別養護老人ホーム', area: '杉並区', address: '東京都杉並区高井戸東2-4-8', tel: '03-5000-1302', careLevels: lv('要介護3', '要介護5'), monthly: 98000, entryFee: 0, welfare: true, dementia: true, medical: ['喀痰吸引', '胃ろう', '看取り'], rooms: 80, vacancy: 1, updatedAt: '2026-10-12', features: ['ユニット型個室', '機能訓練'], hue: 340 },
  { id: 'F03', name: 'グループホーム あおぞら', type: 'グループホーム', area: '練馬区', address: '東京都練馬区石神井町5-3-1', tel: '03-5000-1403', careLevels: lv('要支援2', '要介護5'), monthly: 142000, entryFee: 100000, welfare: true, dementia: true, medical: ['インスリン'], rooms: 18, vacancy: 2, updatedAt: '2026-10-10', features: ['認知症ケア専門', '家庭的な少人数'], hue: 205 },
  { id: 'F04', name: 'ケアレジデンス 板橋', type: '住宅型有料老人ホーム', area: '板橋区', address: '東京都板橋区常盤台1-20-3', tel: '03-5000-1504', careLevels: lv('要支援1', '要介護4'), monthly: 135000, entryFee: 0, welfare: true, dementia: true, medical: ['インスリン', '在宅酸素'], rooms: 45, vacancy: 5, updatedAt: '2026-10-15', features: ['生活保護の方歓迎', '訪問診療あり'], hue: 28 },
  { id: 'F05', name: 'サ高住 みどりの丘', type: 'サービス付き高齢者向け住宅', area: '町田市', address: '東京都町田市玉川学園2-9-14', tel: '042-700-1605', careLevels: lv('要支援1', '要介護2'), monthly: 118000, entryFee: 0, welfare: true, dementia: false, medical: [], rooms: 50, vacancy: 6, updatedAt: '2026-09-20', features: ['自立〜軽度向け', '見守りサービス'], hue: 120 },
  { id: 'F06', name: 'ライフガーデン 足立', type: '介護付き有料老人ホーム', area: '足立区', address: '東京都足立区西新井5-1-22', tel: '03-5000-1706', careLevels: lv('要介護1', '要介護5'), monthly: 168000, entryFee: 0, welfare: true, dementia: true, medical: ['喀痰吸引', '胃ろう', 'インスリン', '看取り'], rooms: 72, vacancy: 4, updatedAt: '2026-10-13', features: ['医療ケア充実', '生活保護対応'], hue: 262 },
  { id: 'F07', name: '江戸川リハビリテーションセンター', type: '介護老人保健施設', area: '江戸川区', address: '東京都江戸川区船堀4-6-2', tel: '03-5000-1807', careLevels: lv('要介護1', '要介護5'), monthly: 125000, entryFee: 0, welfare: true, dementia: true, medical: ['喀痰吸引', '胃ろう', 'インスリン', '在宅酸素'], rooms: 100, vacancy: 0, updatedAt: '2026-10-11', features: ['在宅復帰支援', 'リハビリ専門職'], hue: 190 },
  { id: 'F08', name: 'やすらぎ荘 八王子', type: '特別養護老人ホーム', area: '八王子市', address: '東京都八王子市元本郷町3-18-7', tel: '042-600-1908', careLevels: lv('要介護3', '要介護5'), monthly: 86000, entryFee: 0, welfare: true, dementia: true, medical: ['喀痰吸引', '胃ろう', '看取り'], rooms: 100, vacancy: 2, updatedAt: '2026-10-08', features: ['自然豊かな環境', '多床室あり'], hue: 95 },
  { id: 'F09', name: 'グランフォレスト 世田谷', type: '介護付き有料老人ホーム', area: '世田谷区', address: '東京都世田谷区成城6-2-11', tel: '03-5000-2009', careLevels: lv('要支援1', '要介護5'), monthly: 385000, entryFee: 6800000, welfare: false, dementia: true, medical: ['喀痰吸引', '胃ろう', 'インスリン', '在宅酸素', '看取り'], rooms: 40, vacancy: 2, updatedAt: '2026-10-14', features: ['ホテルライクな住環境', '看護師24時間'], hue: 42 },
  { id: 'F10', name: 'ケアホーム 杉並の森', type: '住宅型有料老人ホーム', area: '杉並区', address: '東京都杉並区阿佐谷北4-7-3', tel: '03-5000-2110', careLevels: lv('要支援1', '要介護3'), monthly: 158000, entryFee: 0, welfare: false, dementia: true, medical: ['インスリン'], rooms: 30, vacancy: 1, updatedAt: '2026-09-28', features: ['駅徒歩5分', 'レクリエーション充実'], hue: 150 },
  { id: 'F11', name: 'グループホーム ねりまの家', type: 'グループホーム', area: '練馬区', address: '東京都練馬区大泉学園町7-1-4', tel: '03-5000-2211', careLevels: lv('要支援2', '要介護5'), monthly: 128000, entryFee: 0, welfare: true, dementia: true, medical: [], rooms: 18, vacancy: 1, updatedAt: '2026-10-09', features: ['認知症ケア専門', '畑・園芸'], hue: 12 },
  { id: 'F12', name: 'メディケア板橋', type: '介護付き有料老人ホーム', area: '板橋区', address: '東京都板橋区大山町8-3', tel: '03-5000-2312', careLevels: lv('要介護1', '要介護5'), monthly: 198000, entryFee: 0, welfare: false, dementia: true, medical: ['喀痰吸引', '胃ろう', 'インスリン', '在宅酸素', '人工透析', '看取り'], rooms: 54, vacancy: 3, updatedAt: '2026-10-15', features: ['人工透析対応', '提携病院隣接'], hue: 225 },
  { id: 'F13', name: 'サ高住 えどがわ苑', type: 'サービス付き高齢者向け住宅', area: '江戸川区', address: '東京都江戸川区西葛西6-10-2', tel: '03-5000-2413', careLevels: lv('要支援1', '要介護3'), monthly: 112000, entryFee: 0, welfare: true, dementia: false, medical: ['インスリン'], rooms: 40, vacancy: 4, updatedAt: '2026-10-07', features: ['生活保護の方歓迎', '食事選択制'], hue: 310 },
  { id: 'F14', name: 'はなみずき 八王子', type: '介護付き有料老人ホーム', area: '八王子市', address: '東京都八王子市東浅川町5-2-9', tel: '042-600-2514', careLevels: lv('要介護1', '要介護5'), monthly: 152000, entryFee: 0, welfare: true, dementia: true, medical: ['喀痰吸引', 'インスリン', '看取り'], rooms: 66, vacancy: 0, updatedAt: '2026-09-15', features: ['看取り実績多数', '送迎あり'], hue: 60 }
];

export const defaultApplicants = [
  { id: 'A01', name: '田中 和子', kana: 'タナカ カズコ', age: 84, gender: '女性', careLevel: '要介護3', areas: ['杉並区', '練馬区'], budget: 150000, welfare: true, dementia: true, medical: [], types: ['特別養護老人ホーム', 'グループホーム'], moveIn: '1か月以内', status: '相談受付', assignee: 'sato', contact: '長女 田中 様', createdAt: '2026-10-14', note: '自宅介護が難しくなり早期入居を希望。' },
  { id: 'A02', name: '高橋 正雄', kana: 'タカハシ マサオ', age: 79, gender: '男性', careLevel: '要介護4', areas: ['足立区', '板橋区'], budget: 200000, welfare: false, dementia: false, medical: ['胃ろう', '喀痰吸引'], types: [], moveIn: '退院後すぐ', status: '候補提示', assignee: 'sato', contact: '妻 高橋 様', createdAt: '2026-10-09', note: '11月上旬に退院予定。医療ケア対応が必須。' },
  { id: 'A03', name: '伊藤 ハル', kana: 'イトウ ハル', age: 91, gender: '女性', careLevel: '要介護2', areas: ['板橋区', '練馬区'], budget: 140000, welfare: true, dementia: true, medical: ['インスリン'], types: [], moveIn: '3か月以内', status: '見学調整', assignee: 'suzuki', contact: 'ケアマネ 小林 様', createdAt: '2026-10-02', note: '生活保護受給中。インスリン注射あり。' },
  { id: 'A04', name: '渡辺 誠一', kana: 'ワタナベ セイイチ', age: 76, gender: '男性', careLevel: '要支援2', areas: ['町田市', '八王子市'], budget: 130000, welfare: false, dementia: false, medical: [], types: ['サービス付き高齢者向け住宅'], moveIn: '半年以内', status: '相談受付', assignee: 'suzuki', contact: '本人', createdAt: '2026-10-11', note: '一人暮らしの不安から住み替えを検討。' },
  { id: 'A05', name: '山口 千代', kana: 'ヤマグチ チヨ', age: 88, gender: '女性', careLevel: '要介護5', areas: ['八王子市'], budget: 100000, welfare: true, dementia: true, medical: ['喀痰吸引', '看取り'], types: ['特別養護老人ホーム'], moveIn: '1か月以内', status: '候補提示', assignee: 'sato', contact: '長男 山口 様', createdAt: '2026-10-05', note: '看取りまで対応できる施設を希望。' },
  { id: 'A07', name: '小林 静江', kana: 'コバヤシ シズエ', age: 86, gender: '女性', careLevel: '要介護2', areas: ['世田谷区', '杉並区'], budget: 250000, welfare: false, dementia: true, medical: ['インスリン'], types: ['介護付き有料老人ホーム'], moveIn: '3か月以内', status: '相談受付', assignee: 'suzuki', contact: '長男 小林 様', createdAt: '2026-10-13', note: '看護師が常駐する施設を希望。ご家族は世田谷区在住。' },
  { id: 'A06', name: '中村 弘', kana: 'ナカムラ ヒロシ', age: 82, gender: '男性', careLevel: '要介護3', areas: ['世田谷区'], budget: 260000, welfare: false, dementia: true, medical: ['人工透析'], types: [], moveIn: '3か月以内', status: '保留', assignee: 'suzuki', contact: '長女 中村 様', createdAt: '2026-09-28', note: '週3回の人工透析あり。世田谷区内を強く希望。' }
];
