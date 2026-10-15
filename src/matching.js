import { DEMO_TODAY } from './data';

export const yen = (n) => `${Math.round(n / 1000).toLocaleString('ja-JP')}千円`;
export const yenFull = (n) => `¥${Number(n).toLocaleString('ja-JP')}`;
export const daysSince = (date) => Math.round((new Date(DEMO_TODAY) - new Date(date)) / 86400000);

/**
 * 必須条件（1つでも満たさなければ候補外）と、希望条件（スコア加点）を分けて照合する。
 * 担当者が「なぜ候補になったか／ならなかったか」を説明できるよう、判定理由をすべて返す。
 */
export function evaluate(facility, applicant) {
  const required = [
    {
      key: 'care',
      label: '介護度の受け入れ',
      ok: facility.careLevels.includes(applicant.careLevel),
      detail: facility.careLevels.includes(applicant.careLevel)
        ? `${applicant.careLevel}に対応`
        : `${facility.careLevels[0]}〜${facility.careLevels[facility.careLevels.length - 1]}のみ`
    },
    {
      key: 'budget',
      label: '月額費用が予算内',
      ok: facility.monthly <= applicant.budget,
      detail: `月額 ${yen(facility.monthly)} ／ 予算 ${yen(applicant.budget)}`
    },
    {
      key: 'vacancy',
      label: '空室あり',
      ok: facility.vacancy > 0,
      detail: facility.vacancy > 0 ? `空室 ${facility.vacancy}室` : '現在満室'
    }
  ];
  if (applicant.welfare) {
    required.push({ key: 'welfare', label: '生活保護に対応', ok: facility.welfare, detail: facility.welfare ? '受け入れ可' : '受け入れ不可' });
  }
  if (applicant.dementia) {
    required.push({ key: 'dementia', label: '認知症に対応', ok: facility.dementia, detail: facility.dementia ? '対応可' : '対応不可' });
  }
  applicant.medical.forEach((m) => {
    required.push({ key: `med-${m}`, label: `医療ケア：${m}`, ok: facility.medical.includes(m), detail: facility.medical.includes(m) ? '対応可' : '対応不可' });
  });

  const areaOk = applicant.areas.length === 0 || applicant.areas.includes(facility.area);
  const typeOk = applicant.types.length === 0 || applicant.types.includes(facility.type);
  const margin = (applicant.budget - facility.monthly) / applicant.budget;
  const fresh = daysSince(facility.updatedAt);

  const preferred = [
    { key: 'area', label: '希望地域', points: areaOk ? 40 : 0, max: 40, ok: areaOk, detail: areaOk ? facility.area : `${facility.area}（希望外）` },
    { key: 'cost', label: '費用のゆとり', points: margin >= 0.15 ? 25 : margin >= 0.05 ? 15 : margin >= 0 ? 8 : 0, max: 25, ok: margin >= 0.05, detail: margin >= 0 ? `予算より ${yen(applicant.budget - facility.monthly)} 低い` : '予算超過' },
    { key: 'type', label: '希望の施設種別', points: typeOk ? 20 : 0, max: 20, ok: typeOk, detail: applicant.types.length === 0 ? '指定なし' : typeOk ? '希望に一致' : '希望外' },
    { key: 'rooms', label: '空室の余裕', points: facility.vacancy >= 3 ? 10 : facility.vacancy >= 1 ? 6 : 0, max: 10, ok: facility.vacancy >= 3, detail: `${facility.vacancy}室` },
    { key: 'fresh', label: '空室情報の鮮度', points: fresh <= 7 ? 5 : fresh <= 14 ? 3 : 0, max: 5, ok: fresh <= 7, detail: fresh === 0 ? '本日更新' : `${fresh}日前に更新` }
  ];

  const passed = required.every((r) => r.ok);
  const score = preferred.reduce((s, p) => s + p.points, 0);
  return { facility, required, preferred, passed, score, failed: required.filter((r) => !r.ok) };
}

export function matchApplicant(applicant, facilities) {
  const results = facilities.map((f) => evaluate(f, applicant));
  return {
    candidates: results.filter((r) => r.passed).sort((a, b) => b.score - a.score),
    excluded: results.filter((r) => !r.passed).sort((a, b) => a.failed.length - b.failed.length)
  };
}

// 施設検索（管理者・相談員向けの自由検索）
export function searchFacilities(facilities, f) {
  return facilities.filter((x) => {
    if (f.keyword && !`${x.name}${x.address}${x.features.join('')}`.includes(f.keyword)) return false;
    if (f.areas.length && !f.areas.includes(x.area)) return false;
    if (f.types.length && !f.types.includes(x.type)) return false;
    if (f.careLevel && !x.careLevels.includes(f.careLevel)) return false;
    if (x.monthly > f.maxCost) return false;
    if (f.welfare && !x.welfare) return false;
    if (f.dementia && !x.dementia) return false;
    if (f.vacancyOnly && x.vacancy === 0) return false;
    if (f.medical.length && !f.medical.every((m) => x.medical.includes(m))) return false;
    return true;
  });
}

export const maskName = (name) => `${name.split(' ')[0]} ＊＊`;
