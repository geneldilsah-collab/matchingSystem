import { useMemo, useState } from 'react';
import Icon from '../components/Icon';
import { Chip, Empty, FacilityThumb, TypeBadge, VacancyPill } from '../components/ui';
import { AREAS, CARE_LEVELS, MEDICAL, TYPES, TYPE_SHORT } from '../data';
import { daysSince, searchFacilities, yen } from '../matching';

const EMPTY = { keyword: '', areas: [], types: [], careLevel: '', maxCost: 400000, welfare: false, dementia: false, vacancyOnly: true, medical: [] };

export default function Search({ ctx }) {
  const { facilities, openFacility } = ctx;
  const [f, setF] = useState(EMPTY);
  const [sort, setSort] = useState('vacancy');
  const [open, setOpen] = useState(false);

  const toggle = (key, v) => setF((s) => ({ ...s, [key]: s[key].includes(v) ? s[key].filter((x) => x !== v) : [...s[key], v] }));
  const set = (key, v) => setF((s) => ({ ...s, [key]: v }));

  const results = useMemo(() => {
    const r = searchFacilities(facilities, f);
    const by = {
      vacancy: (a, b) => b.vacancy - a.vacancy,
      cost: (a, b) => a.monthly - b.monthly,
      fresh: (a, b) => b.updatedAt.localeCompare(a.updatedAt)
    };
    return [...r].sort(by[sort]);
  }, [facilities, f, sort]);

  const activeCount = f.areas.length + f.types.length + f.medical.length + (f.careLevel ? 1 : 0) + (f.welfare ? 1 : 0) + (f.dementia ? 1 : 0) + (f.maxCost < 400000 ? 1 : 0);

  return (
    <div className="page">
      <section className="page-head">
        <div>
          <h1>施設検索</h1>
          <p className="muted">地域・介護度・費用・生活保護対応・空室状況などで絞り込めます。</p>
        </div>
      </section>

      <div className="search-layout">
        <aside className={`filters card ${open ? 'is-open' : ''}`}>
          <div className="filters-head">
            <h2><Icon name="filter" size={18} />絞り込み{activeCount > 0 && <span className="count">{activeCount}</span>}</h2>
            <button type="button" className="text-btn" onClick={() => setF(EMPTY)}>クリア</button>
          </div>

          <div className="field">
            <label>キーワード</label>
            <div className="input-icon"><Icon name="search" size={16} /><input className="input" value={f.keyword} onChange={(e) => set('keyword', e.target.value)} placeholder="施設名・住所・特徴" /></div>
          </div>

          <div className="field">
            <label>地域</label>
            <div className="chips">{AREAS.map((a) => <Chip key={a} active={f.areas.includes(a)} onClick={() => toggle('areas', a)}>{a}</Chip>)}</div>
          </div>

          <div className="field">
            <label>介護度</label>
            <select className="input" value={f.careLevel} onChange={(e) => set('careLevel', e.target.value)}>
              <option value="">指定なし</option>
              {CARE_LEVELS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="field">
            <label>月額費用の上限 <b className="range-val">{f.maxCost >= 400000 ? '上限なし' : yen(f.maxCost)}</b></label>
            <input type="range" min="80000" max="400000" step="10000" value={f.maxCost} onChange={(e) => set('maxCost', Number(e.target.value))} />
            <div className="range-scale"><span>8万円</span><span>40万円〜</span></div>
          </div>

          <div className="field toggles">
            <label className="switch-row"><span>空室がある施設のみ</span><input type="checkbox" checked={f.vacancyOnly} onChange={(e) => set('vacancyOnly', e.target.checked)} /><i /></label>
            <label className="switch-row"><span>生活保護に対応</span><input type="checkbox" checked={f.welfare} onChange={(e) => set('welfare', e.target.checked)} /><i /></label>
            <label className="switch-row"><span>認知症に対応</span><input type="checkbox" checked={f.dementia} onChange={(e) => set('dementia', e.target.checked)} /><i /></label>
          </div>

          <div className="field">
            <label>施設種別</label>
            <div className="chips">{TYPES.map((t) => <Chip key={t} active={f.types.includes(t)} onClick={() => toggle('types', t)}>{TYPE_SHORT[t]}</Chip>)}</div>
          </div>

          <div className="field">
            <label>必要な医療ケア</label>
            <div className="chips">{MEDICAL.map((m) => <Chip key={m} active={f.medical.includes(m)} onClick={() => toggle('medical', m)}>{m}</Chip>)}</div>
          </div>

          <button type="button" className="btn block show-mobile" onClick={() => setOpen(false)}>{results.length}件の結果を見る</button>
        </aside>

        <section className="results">
          <div className="results-bar">
            <button type="button" className="btn ghost show-mobile" onClick={() => setOpen(true)}><Icon name="filter" size={16} />絞り込み{activeCount > 0 && `（${activeCount}）`}</button>
            <p><b>{results.length}</b> 件の施設</p>
            <select className="input sm" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="並び替え">
              <option value="vacancy">空室が多い順</option>
              <option value="cost">月額が安い順</option>
              <option value="fresh">更新が新しい順</option>
            </select>
          </div>

          {results.length === 0 && <Empty title="条件に合う施設が見つかりません" text="条件をゆるめるか、「空室がある施設のみ」をオフにしてください。" />}

          <div className="fac-grid">
            {results.map((x) => (
              <button key={x.id} type="button" className="fac-card" onClick={() => openFacility(x.id)}>
                <div className="fac-top">
                  <FacilityThumb facility={x} />
                  <div className="fac-title">
                    <TypeBadge type={x.type} />
                    <b>{x.name}</b>
                    <small><Icon name="pin" size={13} />{x.area}</small>
                  </div>
                  <VacancyPill n={x.vacancy} />
                </div>
                <div className="fac-stats">
                  <div><small>月額目安</small><b>{yen(x.monthly)}</b></div>
                  <div><small>入居金</small><b>{x.entryFee ? yen(x.entryFee) : '0円'}</b></div>
                  <div><small>介護度</small><b>{x.careLevels[0].replace('要', '')}〜{x.careLevels[x.careLevels.length - 1].replace('要', '')}</b></div>
                </div>
                <div className="tags">
                  {x.welfare && <span className="tag tag-blue">生活保護対応</span>}
                  {x.dementia && <span className="tag tag-purple">認知症対応</span>}
                  {x.medical.slice(0, 3).map((m) => <span key={m} className="tag">{m}</span>)}
                  {x.medical.length > 3 && <span className="tag">+{x.medical.length - 3}</span>}
                </div>
                <div className="fac-foot">
                  <span className={daysSince(x.updatedAt) >= 14 ? 'warn-text' : ''}><Icon name="clock" size={13} />{daysSince(x.updatedAt) === 0 ? '本日更新' : `${daysSince(x.updatedAt)}日前に更新`}</span>
                  <span className="more">詳細を見る<Icon name="arrow" size={14} /></span>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
