import { useState } from 'react';
import Icon from '../components/Icon';
import { Empty } from '../components/ui';
import { STATUSES, USERS } from '../data';
import { matchApplicant, maskName, yen } from '../matching';
import ApplicantForm from './ApplicantForm';

export default function Applicants({ ctx }) {
  const { applicants, facilities, user, update, toast, go } = ctx;
  const [status, setStatus] = useState('すべて');
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState(null);

  const canSee = (a) => user.role === 'admin' || a.assignee === user.id;
  const staffName = (id) => USERS.find((u) => u.id === id)?.name ?? '—';
  const list = applicants
    .filter((a) => status === 'すべて' || a.status === status)
    .filter((a) => !q || (canSee(a) && `${a.name}${a.kana}`.includes(q)))
    .sort((a, b) => Number(canSee(b)) - Number(canSee(a)) || b.createdAt.localeCompare(a.createdAt));

  const changeStatus = (a, s) => {
    update('applicants', (l) => l.map((x) => (x.id === a.id ? { ...x, status: s } : x)));
    toast(`${a.name} 様のステータスを「${s}」に変更しました`);
  };

  return (
    <div className="page">
      <section className="page-head">
        <div>
          <h1>入居希望者</h1>
          <p className="muted">希望条件を登録すると、条件に合う施設をすぐに確認できます。</p>
        </div>
        <button type="button" className="btn" onClick={() => setEditing('new')}><Icon name="plus" size={16} />新規登録</button>
      </section>

      <div className="toolbar">
        <div className="input-icon grow"><Icon name="search" size={16} /><input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="氏名・フリガナで検索" /></div>
        <div className="seg">
          {['すべて', ...STATUSES].map((s) => <button key={s} type="button" className={status === s ? 'is-active' : ''} onClick={() => setStatus(s)}>{s}</button>)}
        </div>
      </div>

      {list.length === 0 && <Empty icon="users" title="該当する入居希望者はいません" />}

      <div className="app-grid">
        {list.map((a) => {
          const own = canSee(a);
          const n = own ? matchApplicant(a, facilities).candidates.length : null;
          return (
            <article key={a.id} className={`app-card ${own ? '' : 'locked'}`}>
              <div className="app-top">
                <span className="avatar lg soft">{a.name[0]}</span>
                <div className="app-title">
                  <b>{own ? a.name : maskName(a.name)}{!own && <Icon name="lock" size={14} />}</b>
                  <small>{own ? `${a.kana}・${a.age}歳・${a.gender}` : '担当外のため詳細は非表示'}</small>
                </div>
                {own ? (
                  <select className={`status-select s-${a.status}`} value={a.status} onChange={(e) => changeStatus(a, e.target.value)} aria-label="ステータス">
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                ) : <span className={`status s-${a.status}`}>{a.status}</span>}
              </div>

              <div className="app-conds">
                <span><small>介護度</small><b>{a.careLevel}</b></span>
                <span><small>予算</small><b>{own ? yen(a.budget) : '—'}</b></span>
                <span><small>希望地域</small><b>{own ? a.areas.join('・') || '指定なし' : '—'}</b></span>
              </div>

              {own && (
                <div className="tags">
                  {a.welfare && <span className="tag tag-blue">生活保護</span>}
                  {a.dementia && <span className="tag tag-purple">認知症</span>}
                  {a.medical.map((m) => <span key={m} className="tag">{m}</span>)}
                  <span className="tag light"><Icon name="clock" size={12} />{a.moveIn}</span>
                </div>
              )}

              <div className="app-foot">
                <small>担当：{staffName(a.assignee)}</small>
                {own && (
                  <div className="app-actions">
                    <button type="button" className="icon-btn" onClick={() => setEditing(a)} aria-label="編集"><Icon name="edit" size={16} /></button>
                    <button type="button" className="match-btn" onClick={() => go('match', { applicantId: a.id })}><Icon name="spark" size={14} />候補 {n}件</button>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {user.role === 'staff' && <p className="hint"><Icon name="lock" size={14} />個人情報保護のため、他の相談員が担当する入居希望者の氏名・条件は表示されません。</p>}

      {editing && <ApplicantForm ctx={ctx} applicant={editing === 'new' ? null : editing} onClose={() => setEditing(null)} />}
    </div>
  );
}
