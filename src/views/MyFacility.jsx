import { useState } from 'react';
import Icon from '../components/Icon';
import { FacilityThumb, TypeBadge, VacancyPill } from '../components/ui';
import { CARE_LEVELS, DEMO_TODAY } from '../data';
import { daysSince, evaluate, yen } from '../matching';
import FacilityForm from './FacilityForm';

export default function MyFacility({ ctx }) {
  const { facilities, applicants, user, update, toast } = ctx;
  const f = facilities.find((x) => x.id === user.facilityId);
  const [count, setCount] = useState(f.vacancy);
  const [editing, setEditing] = useState(false);
  const demand = applicants.filter((a) => {
    const r = evaluate({ ...f, vacancy: Math.max(1, f.vacancy) }, a);
    return r.passed;
  }).length;
  const days = daysSince(f.updatedAt);

  const report = () => {
    update('facilities', (l) => l.map((x) => (x.id === f.id ? { ...x, vacancy: count, updatedAt: DEMO_TODAY } : x)));
    toast(count === f.vacancy ? '空室数に変更なし（確認日を記録しました）' : `空室数を ${count} 室で報告しました`);
  };

  return (
    <div className="page narrow">
      <section className="page-head">
        <div>
          <h1>自施設の管理</h1>
          <p className="muted">空室状況はスマートフォンからでも、数タップで更新できます。</p>
        </div>
      </section>

      <div className="card my-fac">
        <div className="detail-hero" style={{ '--h': f.hue }}>
          <FacilityThumb facility={f} size="lg" />
          <div>
            <TypeBadge type={f.type} />
            <h2>{f.name}</h2>
            <p><Icon name="pin" size={14} />{f.address}</p>
          </div>
        </div>

        <div className="report">
          <div className="report-head">
            <h3>本日の空室数を報告</h3>
            <span className={days >= 14 ? 'warn-text small' : 'muted small'}><Icon name="clock" size={13} />前回報告：{days === 0 ? '本日' : `${days}日前`}</span>
          </div>
          <div className="big-stepper">
            <button type="button" onClick={() => setCount(Math.max(0, count - 1))} aria-label="減らす"><Icon name="minus" size={26} /></button>
            <div><b>{count}</b><small>室 ／ 定員 {f.rooms}室</small></div>
            <button type="button" onClick={() => setCount(Math.min(f.rooms, count + 1))} aria-label="増やす"><Icon name="plus" size={26} /></button>
          </div>
          <button type="button" className="btn block lg" onClick={report}><Icon name="send" size={18} />この内容で報告する</button>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h2 className="card-title">受け入れ条件</h2>
          <div className="levels compact">{CARE_LEVELS.map((c) => <span key={c} className={f.careLevels.includes(c) ? 'on' : ''}>{c.replace('要', '')}</span>)}</div>
          <dl className="cost">
            <dt>月額目安</dt><dd>{yen(f.monthly)}</dd>
            <dt>生活保護</dt><dd>{f.welfare ? '受け入れ可' : '不可'}</dd>
            <dt>認知症</dt><dd>{f.dementia ? '対応可' : '不可'}</dd>
            <dt>医療ケア</dt><dd>{f.medical.join('・') || 'なし'}</dd>
          </dl>
          <button type="button" className="btn ghost block" onClick={() => setEditing(true)}><Icon name="edit" size={16} />受け入れ条件・費用を編集</button>
        </div>
        <div className="card demand">
          <h2 className="card-title">貴施設の条件に合う入居希望者</h2>
          <b className="big">{demand}<small> 名</small></b>
          <p className="muted small">現在登録されている入居希望者のうち、受け入れ条件をすべて満たす方の人数です。</p>
          <p className="hint"><Icon name="lock" size={14} />個人情報保護のため、氏名などの詳細は相談員からのご連絡時にお伝えします。</p>
          <VacancyPill n={f.vacancy} />
        </div>
      </div>

      {editing && <FacilityForm ctx={ctx} facility={f} onClose={() => setEditing(false)} />}
    </div>
  );
}
