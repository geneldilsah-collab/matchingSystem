import { useState } from 'react';
import Icon from '../components/Icon';
import { FacilityThumb, TypeBadge, VacancyPill } from '../components/ui';
import { DEMO_TODAY } from '../data';
import { daysSince, yen } from '../matching';
import FacilityForm from './FacilityForm';

export default function Facilities({ ctx }) {
  const { facilities, update, toast, openFacility } = ctx;
  const [q, setQ] = useState('');
  const [onlyStale, setOnlyStale] = useState(false);
  const [creating, setCreating] = useState(false);

  const list = facilities
    .filter((f) => !q || `${f.name}${f.area}`.includes(q))
    .filter((f) => !onlyStale || daysSince(f.updatedAt) >= 14);

  const setVacancy = (f, n) => {
    const v = Math.max(0, Math.min(f.rooms, n));
    update('facilities', (l) => l.map((x) => (x.id === f.id ? { ...x, vacancy: v, updatedAt: DEMO_TODAY } : x)));
    toast(`${f.name}：空室 ${v} 室に更新`);
  };

  return (
    <div className="page">
      <section className="page-head">
        <div>
          <h1>施設管理</h1>
          <p className="muted">施設情報の登録・編集と、空室状況の更新を行います。</p>
        </div>
        <button type="button" className="btn" onClick={() => setCreating(true)}><Icon name="plus" size={16} />施設を登録</button>
      </section>

      <div className="toolbar">
        <div className="input-icon grow"><Icon name="search" size={16} /><input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="施設名・地域で検索" /></div>
        <label className="switch-row compact"><span>更新が古い施設のみ</span><input type="checkbox" checked={onlyStale} onChange={(e) => setOnlyStale(e.target.checked)} /><i /></label>
      </div>

      <div className="card table-card">
        <table className="table">
          <thead>
            <tr><th>施設</th><th>種別</th><th>月額目安</th><th>生活保護</th><th>空室（クリックで増減）</th><th>最終更新</th><th></th></tr>
          </thead>
          <tbody>
            {list.map((f) => {
              const days = daysSince(f.updatedAt);
              return (
                <tr key={f.id}>
                  <td data-label="施設">
                    <button type="button" className="cell-fac" onClick={() => openFacility(f.id)}>
                      <FacilityThumb facility={f} size="sm" />
                      <span><b>{f.name}</b><small>{f.area}</small></span>
                    </button>
                  </td>
                  <td data-label="種別"><TypeBadge type={f.type} /></td>
                  <td data-label="月額目安">{yen(f.monthly)}</td>
                  <td data-label="生活保護">{f.welfare ? <span className="tag tag-blue">対応</span> : <span className="muted">—</span>}</td>
                  <td data-label="空室">
                    <div className="stepper sm">
                      <button type="button" onClick={() => setVacancy(f, f.vacancy - 1)} aria-label="減らす"><Icon name="minus" size={14} /></button>
                      <span>{f.vacancy}<small>/{f.rooms}</small></span>
                      <button type="button" onClick={() => setVacancy(f, f.vacancy + 1)} aria-label="増やす"><Icon name="plus" size={14} /></button>
                    </div>
                  </td>
                  <td data-label="最終更新"><span className={days >= 14 ? 'warn-text' : 'muted'}>{days >= 14 && <Icon name="alert" size={13} />}{days === 0 ? '本日' : `${days}日前`}</span></td>
                  <td><button type="button" className="icon-btn" onClick={() => openFacility(f.id)} aria-label="詳細"><Icon name="arrow" size={16} /></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {creating && <FacilityForm ctx={ctx} onClose={() => setCreating(false)} />}
    </div>
  );
}
