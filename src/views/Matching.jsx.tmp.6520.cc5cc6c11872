import { useEffect, useMemo, useState } from 'react';
import Icon from '../components/Icon';
import { Chip, Empty, FacilityThumb, ScoreRing, TypeBadge, VacancyPill } from '../components/ui';
import { AREAS, DEMO_TODAY, TYPES, TYPE_SHORT } from '../data';
import { matchApplicant, yen } from '../matching';

export default function Matching({ ctx, targetId, setTargetId }) {
  const { applicants, facilities, history, user, update, toast, openFacility } = ctx;
  const visible = user.role === 'admin' ? applicants : applicants.filter((a) => a.assignee === user.id);
  const selected = visible.find((a) => a.id === targetId) ?? visible[0];
  const [draft, setDraft] = useState(selected);
  const [showExcluded, setShowExcluded] = useState(false);

  useEffect(() => {
    setDraft(selected);
    setShowExcluded(false);
  }, [selected?.id]);

  const { candidates, excluded } = useMemo(() => (draft ? matchApplicant(draft, facilities) : { candidates: [], excluded: [] }), [draft, facilities]);

  if (!selected) {
    return <div className="page"><Empty icon="users" title="担当の入居希望者がいません" text="入居希望者を登録するとマッチングできます。" /></div>;
  }

  const dirty = JSON.stringify(draft) !== JSON.stringify(selected);
  const toggle = (k, v) => setDraft((d) => ({ ...d, [k]: d[k].includes(v) ? d[k].filter((x) => x !== v) : [...d[k], v] }));

  const saveDraft = () => {
    update('applicants', (list) => list.map((a) => (a.id === draft.id ? draft : a)));
    toast('希望条件を保存しました');
  };

  const propose = (r) => {
    const exists = history.some((h) => h.applicantId === selected.id && h.facilityId === r.facility.id);
    if (exists) {
      toast('この施設はすでに候補として提示済みです', 'warn');
      return;
    }
    update('history', (h) => [{ id: `H${Date.now()}`, applicantId: selected.id, facilityId: r.facility.id, score: r.score, at: DEMO_TODAY, by: user.id }, ...h]);
    update('applicants', (list) => list.map((a) => (a.id === selected.id && a.status === '相談受付' ? { ...a, status: '候補提示' } : a)));
    toast(`「${r.facility.name}」を候補として記録しました`);
  };

  const proposed = (fid) => history.some((h) => h.applicantId === selected.id && h.facilityId === fid);

  return (
    <div className="page">
      <section className="page-head">
        <div>
          <h1>マッチング</h1>
          <p className="muted">必須条件をすべて満たす施設だけを候補にし、希望条件の一致度で並べます。</p>
        </div>
      </section>

      <div className="person-strip">
        {visible.map((a) => (
          <button key={a.id} type="button" className={`person ${a.id === selected.id ? 'is-active' : ''}`} onClick={() => setTargetId(a.id)}>
            <span className="avatar soft">{a.name[0]}</span>
            <span><b>{a.name}</b><small>{a.careLevel}・{a.age}歳</small></span>
          </button>
        ))}
      </div>

      <div className="match-layout">
        <aside className="card cond">
          <div className="cond-head">
            <span className="avatar lg">{selected.name[0]}</span>
            <div><b>{selected.name} 様</b><small>{selected.kana}・{selected.age}歳・{selected.gender}</small></div>
          </div>

          <h4 className="cond-title"><span className="req-dot" />必須条件</h4>
          <div className="cond-list">
            <div><span>介護度</span><b>{draft.careLevel}</b></div>
            <div><span>予算（月額上限）</span><b>{yen(draft.budget)}</b></div>
            <input type="range" min="80000" max="400000" step="5000" value={draft.budget} onChange={(e) => setDraft({ ...draft, budget: Number(e.target.value) })} aria-label="予算" />
            <div><span>生活保護</span><b>{draft.welfare ? '受給中' : 'なし'}</b></div>
            <div><span>認知症</span><b>{draft.dementia ? 'あり' : 'なし'}</b></div>
            <div><span>医療ケア</span><b>{draft.medical.length ? draft.medical.join('・') : 'なし'}</b></div>
            <div><span>空室</span><b>あり</b></div>
          </div>

          <h4 className="cond-title"><span className="pref-dot" />希望条件</h4>
          <label className="small muted">希望地域</label>
          <div className="chips tight">{AREAS.map((a) => <Chip key={a} active={draft.areas.includes(a)} onClick={() => toggle('areas', a)}>{a}</Chip>)}</div>
          <label className="small muted">希望の施設種別</label>
          <div className="chips tight">{TYPES.map((t) => <Chip key={t} active={draft.types.includes(t)} onClick={() => toggle('types', t)}>{TYPE_SHORT[t]}</Chip>)}</div>

          {dirty && (
            <div className="dirty">
              <p><Icon name="refresh" size={14} />条件を変更して再検索中です</p>
              <div>
                <button type="button" className="btn ghost sm" onClick={() => setDraft(selected)}>元に戻す</button>
                <button type="button" className="btn sm" onClick={saveDraft}>条件を保存</button>
              </div>
            </div>
          )}
          <p className="note-box"><Icon name="layers" size={14} />{selected.note}</p>
        </aside>

        <section className="cands">
          <div className="results-bar">
            <p><b className="primary-text">{candidates.length}</b> 件の候補施設 <span className="muted">／ 候補外 {excluded.length} 件</span></p>
          </div>

          {candidates.length === 0 && <Empty icon="spark" title="必須条件をすべて満たす施設がありません" text="予算や希望地域を見直すか、下の「候補外の施設」で理由を確認してください。" />}

          {candidates.map((r, i) => (
            <article key={r.facility.id} className="cand">
              <div className="cand-main">
                <div className="rank">{i + 1}</div>
                <FacilityThumb facility={r.facility} />
                <div className="cand-title">
                  <div className="cand-badges"><TypeBadge type={r.facility.type} /><VacancyPill n={r.facility.vacancy} />{proposed(r.facility.id) && <span className="pill pill-blue">提示済み</span>}</div>
                  <b>{r.facility.name}</b>
                  <small><Icon name="pin" size={13} />{r.facility.area}・月額 {yen(r.facility.monthly)}</small>
                </div>
                <ScoreRing score={r.score} />
              </div>

              <div className="why">
                <div className="why-col">
                  <h5>必須条件 <span className="ok-text">すべて満たす</span></h5>
                  <ul>{r.required.map((q) => <li key={q.key} className="ok"><Icon name="check" size={13} stroke={3} /><span>{q.label}</span><small>{q.detail}</small></li>)}</ul>
                </div>
                <div className="why-col">
                  <h5>希望条件の一致度</h5>
                  {r.preferred.map((p) => (
                    <div key={p.key} className="pref">
                      <div className="pref-top"><span>{p.label}<em className="pts">{p.points}/{p.max}</em></span><small>{p.detail}</small></div>
                      <div className="pref-bar"><i style={{ width: `${(p.points / p.max) * 100}%` }} /></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="cand-actions">
                <button type="button" className="btn ghost sm" onClick={() => openFacility(r.facility.id)}>施設の詳細</button>
                <button type="button" className="btn sm" onClick={() => propose(r)} disabled={proposed(r.facility.id)}>
                  <Icon name="send" size={14} />{proposed(r.facility.id) ? '提示済み' : '候補として提示'}
                </button>
              </div>
            </article>
          ))}

          <div className="excluded card">
            <button type="button" className="excluded-toggle" onClick={() => setShowExcluded(!showExcluded)}>
              <span><Icon name="x" size={16} />候補外の施設（{excluded.length}件）と理由</span>
              <Icon name={showExcluded ? 'minus' : 'plus'} size={16} />
            </button>
            {showExcluded && (
              <div className="list">
                {excluded.map((r) => (
                  <div key={r.facility.id} className="row ex-row">
                    <div className="row-main">
                      <b>{r.facility.name}<TypeBadge type={r.facility.type} /></b>
                      <div className="reasons">{r.failed.map((q) => <span key={q.key}><Icon name="x" size={12} stroke={3} />{q.label}：{q.detail}</span>)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <p className="hint"><Icon name="shield" size={14} />一致度はあくまで目安です。実際の受け入れ可否は、施設への確認を経て判断します。</p>
        </section>
      </div>
    </div>
  );
}
