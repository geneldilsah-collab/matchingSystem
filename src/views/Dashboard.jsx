import Icon from '../components/Icon';
import { TypeBadge, VacancyPill } from '../components/ui';
import { AREAS, DEMO_TODAY, USERS } from '../data';
import { daysSince, matchApplicant, maskName } from '../matching';

export default function Dashboard({ ctx }) {
  const { facilities, applicants, history, user, go, openFacility } = ctx;
  const mine = user.role === 'staff' ? applicants.filter((a) => a.assignee === user.id) : applicants;
  const active = mine.filter((a) => a.status !== '入居決定');
  const totalVacancy = facilities.reduce((s, f) => s + f.vacancy, 0);
  const withVacancy = facilities.filter((f) => f.vacancy > 0).length;
  const stale = facilities.filter((f) => daysSince(f.updatedAt) >= 14).sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));
  const byArea = AREAS.map((a) => ({ area: a, n: facilities.filter((f) => f.area === a).reduce((s, f) => s + f.vacancy, 0) }));
  const maxArea = Math.max(1, ...byArea.map((x) => x.n));
  const staffName = (id) => USERS.find((u) => u.id === id)?.name ?? '—';
  const d = new Date(DEMO_TODAY);

  return (
    <div className="page">
      <section className="hello">
        <div>
          <p className="eyebrow">{d.getMonth() + 1}月{d.getDate()}日（水）</p>
          <h1>おはようございます、{user.name.split(' ')[0]}さん</h1>
          <p className="muted">{user.role === 'staff' ? '担当の入居希望者と、条件に合う空室を確認しましょう。' : '施設の空室状況と、入居希望者の状況をまとめています。'}</p>
        </div>
        <div className="hello-actions">
          <button type="button" className="btn ghost" onClick={() => go('search')}><Icon name="search" size={16} />施設を探す</button>
          <button type="button" className="btn" onClick={() => go('applicants')}><Icon name="plus" size={16} />入居希望者を登録</button>
        </div>
      </section>

      <section className="kpis">
        <div className="kpi kpi-primary">
          <span className="kpi-icon"><Icon name="bed" /></span>
          <small>空室数（合計）</small>
          <b>{totalVacancy}<em>室</em></b>
          <span className="kpi-sub">{withVacancy} / {facilities.length} 施設に空室あり</span>
        </div>
        <div className="kpi">
          <span className="kpi-icon"><Icon name="users" /></span>
          <small>{user.role === 'staff' ? '担当の入居希望者' : '対応中の入居希望者'}</small>
          <b>{active.length}<em>名</em></b>
          <span className="kpi-sub">相談受付 {active.filter((a) => a.status === '相談受付').length} 名</span>
        </div>
        <div className="kpi">
          <span className="kpi-icon"><Icon name="send" /></span>
          <small>今月の候補提示</small>
          <b>{history.length + 7}<em>件</em></b>
          <span className="kpi-sub">見学調整 {mine.filter((a) => a.status === '見学調整').length} 件</span>
        </div>
        <div className="kpi">
          <span className="kpi-icon warn"><Icon name="clock" /></span>
          <small>空室情報が古い施設</small>
          <b className={stale.length ? 'warn-text' : ''}>{stale.length}<em>施設</em></b>
          <span className="kpi-sub">14日以上 更新なし</span>
        </div>
      </section>

      <div className="grid-2">
        <section className="card">
          <div className="card-head">
            <h2>対応中の入居希望者</h2>
            <button type="button" className="text-btn" onClick={() => go('applicants')}>すべて見る<Icon name="arrow" size={14} /></button>
          </div>
          <div className="list">
            {active.slice(0, 5).map((a) => {
              const { candidates } = matchApplicant(a, facilities);
              const own = user.role === 'admin' || a.assignee === user.id;
              return (
                <div key={a.id} className="row">
                  <span className="avatar soft">{a.name[0]}</span>
                  <div className="row-main">
                    <b>{own ? a.name : maskName(a.name)}<span className={`status s-${a.status}`}>{a.status}</span></b>
                    <small>{a.careLevel}・{a.areas.join('／')}・担当 {staffName(a.assignee)}</small>
                  </div>
                  <button type="button" className="match-btn" onClick={() => go('match', { applicantId: a.id })}>
                    <Icon name="spark" size={14} />候補 {candidates.length}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <section className="card">
          <div className="card-head"><h2>地域別の空室数</h2><span className="muted small">全{facilities.length}施設</span></div>
          <div className="bars">
            {byArea.map((x) => (
              <div key={x.area} className="bar-row">
                <span>{x.area}</span>
                <div className="bar"><i style={{ width: `${(x.n / maxArea) * 100}%` }} /></div>
                <b>{x.n}</b>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid-2">
        <section className="card">
          <div className="card-head"><h2>空室情報の更新が止まっている施設</h2></div>
          {stale.length === 0 && <p className="muted">すべての施設が2週間以内に更新されています。</p>}
          <div className="list">
            {stale.map((f) => (
              <button key={f.id} type="button" className="row as-btn" onClick={() => openFacility(f.id)}>
                <span className="dot-warn"><Icon name="alert" size={16} /></span>
                <div className="row-main"><b>{f.name}</b><small>{f.area}・最終更新 {f.updatedAt}（{daysSince(f.updatedAt)}日前）</small></div>
                <VacancyPill n={f.vacancy} />
              </button>
            ))}
          </div>
          <p className="hint"><Icon name="layers" size={14} />本番では、施設担当者へ更新依頼メールを自動送信する機能を追加できます。</p>
        </section>

        <section className="card">
          <div className="card-head"><h2>最近の候補提示</h2></div>
          {history.length === 0 && (
            <p className="muted">まだ提示履歴はありません。マッチング画面で「候補として提示」すると記録されます。</p>
          )}
          <div className="list">
            {history.slice(0, 5).map((h) => {
              const f = facilities.find((x) => x.id === h.facilityId);
              const a = applicants.find((x) => x.id === h.applicantId);
              if (!f || !a) return null;
              return (
                <div key={h.id} className="row">
                  <span className="avatar soft">{a.name[0]}</span>
                  <div className="row-main"><b>{f.name}</b><small>{(user.role === 'admin' || a.assignee === user.id) ? a.name : maskName(a.name)} 様へ・一致度 {h.score}点・{h.at}</small></div>
                  <TypeBadge type={f.type} />
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
