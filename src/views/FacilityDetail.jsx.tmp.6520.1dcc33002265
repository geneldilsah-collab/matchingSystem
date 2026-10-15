import { useState } from 'react';
import Icon from '../components/Icon';
import { FacilityThumb, Modal, TypeBadge, VacancyPill } from '../components/ui';
import { CARE_LEVELS, DEMO_TODAY, MEDICAL } from '../data';
import { daysSince, evaluate, maskName, yen, yenFull } from '../matching';
import FacilityForm from './FacilityForm';

export default function FacilityDetail({ ctx, facility: f, onClose }) {
  const { applicants, user, update, toast, go } = ctx;
  const [editing, setEditing] = useState(false);
  const canEdit = user.role === 'admin' || (user.role === 'facility' && user.facilityId === f.id);
  const canSeeApplicants = user.role !== 'facility';

  const fits = canSeeApplicants
    ? applicants
        .filter((a) => user.role === 'admin' || a.assignee === user.id)
        .map((a) => ({ a, r: evaluate(f, a) }))
        .filter((x) => x.r.passed)
        .sort((x, y) => y.r.score - x.r.score)
    : [];

  const setVacancy = (n) => {
    const v = Math.max(0, Math.min(f.rooms, n));
    update('facilities', (list) => list.map((x) => (x.id === f.id ? { ...x, vacancy: v, updatedAt: DEMO_TODAY } : x)));
    toast(`空室数を ${v} 室に更新しました`);
  };

  if (editing) {
    return <FacilityForm ctx={ctx} facility={f} onClose={() => setEditing(false)} />;
  }

  return (
    <Modal
      title={f.name}
      subtitle={`${f.type}・${f.area}`}
      onClose={onClose}
      wide
      footer={
        <>
          <a className="btn ghost" href={`tel:${f.tel}`}><Icon name="phone" size={16} />{f.tel}</a>
          {canEdit && <button type="button" className="btn" onClick={() => setEditing(true)}><Icon name="edit" size={16} />施設情報を編集</button>}
        </>
      }
    >
      <div className="detail-hero" style={{ '--h': f.hue }}>
        <FacilityThumb facility={f} size="lg" />
        <div>
          <TypeBadge type={f.type} />
          <p><Icon name="pin" size={14} />{f.address}</p>
          <div className="tags">{f.features.map((x) => <span key={x} className="tag light">{x}</span>)}</div>
        </div>
      </div>

      <div className="detail-grid">
        <div className="panel">
          <h4><Icon name="bed" size={16} />空室状況</h4>
          <div className="vacancy-box">
            <div>
              <b className="big">{f.vacancy}<small> / {f.rooms}室</small></b>
              <VacancyPill n={f.vacancy} />
            </div>
            {canEdit && (
              <div className="stepper">
                <button type="button" onClick={() => setVacancy(f.vacancy - 1)} aria-label="空室を減らす"><Icon name="minus" size={16} /></button>
                <span>{f.vacancy}</span>
                <button type="button" onClick={() => setVacancy(f.vacancy + 1)} aria-label="空室を増やす"><Icon name="plus" size={16} /></button>
              </div>
            )}
          </div>
          <p className={`small ${daysSince(f.updatedAt) >= 14 ? 'warn-text' : 'muted'}`}><Icon name="clock" size={13} />最終更新 {f.updatedAt}（{daysSince(f.updatedAt) === 0 ? '本日' : `${daysSince(f.updatedAt)}日前`}）</p>
        </div>

        <div className="panel">
          <h4><Icon name="yen" size={16} />費用</h4>
          <dl className="cost">
            <dt>月額目安</dt><dd><b>{yenFull(f.monthly)}</b></dd>
            <dt>入居一時金</dt><dd>{f.entryFee ? yenFull(f.entryFee) : 'なし'}</dd>
            <dt>生活保護</dt><dd>{f.welfare ? <span className="tag tag-blue">受け入れ可</span> : <span className="tag">受け入れ不可</span>}</dd>
          </dl>
        </div>

        <div className="panel span-2">
          <h4><Icon name="users" size={16} />受け入れ可能な介護度</h4>
          <div className="levels">
            {CARE_LEVELS.map((c) => <span key={c} className={f.careLevels.includes(c) ? 'on' : ''}>{c}</span>)}
          </div>
        </div>

        <div className="panel span-2">
          <h4><Icon name="heart" size={16} />医療ケア・認知症への対応</h4>
          <div className="med-grid">
            <span className={f.dementia ? 'on' : ''}><Icon name={f.dementia ? 'check' : 'x'} size={14} stroke={3} />認知症</span>
            {MEDICAL.map((m) => <span key={m} className={f.medical.includes(m) ? 'on' : ''}><Icon name={f.medical.includes(m) ? 'check' : 'x'} size={14} stroke={3} />{m}</span>)}
          </div>
        </div>

        {canSeeApplicants && (
          <div className="panel span-2">
            <h4><Icon name="spark" size={16} />この施設の条件に合う入居希望者{user.role === 'staff' && '（担当分）'}</h4>
            {fits.length === 0 && <p className="muted small">現在、必須条件をすべて満たす入居希望者はいません。</p>}
            <div className="list">
              {fits.map(({ a, r }) => (
                <div key={a.id} className="row">
                  <span className="avatar soft">{a.name[0]}</span>
                  <div className="row-main"><b>{a.name}</b><small>{a.careLevel}・予算 {yen(a.budget)}・{a.areas.join('／')}</small></div>
                  <button type="button" className="match-btn" onClick={() => { onClose(); go('match', { applicantId: a.id }); }}>一致度 {r.score}点</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {!canSeeApplicants && <p className="hint"><Icon name="lock" size={14} />施設担当者には、入居希望者の個人情報は表示されません。</p>}
      {user.role === 'staff' && <p className="hint"><Icon name="lock" size={14} />他の相談員が担当する入居希望者は表示されません（例：{maskName('山田 太郎')}）。</p>}
    </Modal>
  );
}
