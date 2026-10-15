import { useState } from 'react';
import Icon from '../components/Icon';
import { Chip, Modal } from '../components/ui';
import { AREAS, CARE_LEVELS, DEMO_TODAY, MEDICAL, STATUSES, TYPES, TYPE_SHORT, USERS } from '../data';
import { yen } from '../matching';

export default function ApplicantForm({ ctx, applicant, onClose }) {
  const { update, toast, user, go } = ctx;
  const isNew = !applicant;
  const [a, setA] = useState(
    applicant ?? {
      name: '', kana: '', age: 80, gender: '女性', careLevel: '要介護2', areas: [], budget: 150000, welfare: false, dementia: false,
      medical: [], types: [], moveIn: '3か月以内', status: '相談受付', assignee: user.role === 'staff' ? user.id : 'sato', contact: '', note: ''
    }
  );
  const [errors, setErrors] = useState({});
  const set = (k, v) => setA((s) => ({ ...s, [k]: v }));
  const toggle = (k, v) => setA((s) => ({ ...s, [k]: s[k].includes(v) ? s[k].filter((x) => x !== v) : [...s[k], v] }));

  const save = (thenMatch = false) => {
    const e = {};
    if (!a.name.trim()) e.name = '氏名を入力してください';
    if (!(a.age >= 40 && a.age <= 120)) e.age = '年齢を確認してください';
    if (!(a.budget > 0)) e.budget = '予算を入力してください';
    setErrors(e);
    if (Object.keys(e).length) {
      toast('入力内容を確認してください', 'warn');
      return;
    }
    let id = applicant?.id;
    if (isNew) {
      id = `A${String(Date.now()).slice(-4)}`;
      update('applicants', (l) => [{ ...a, id, createdAt: DEMO_TODAY }, ...l]);
      toast(`${a.name} 様を登録しました`);
    } else {
      update('applicants', (l) => l.map((x) => (x.id === id ? a : x)));
      toast('希望条件を更新しました');
    }
    onClose();
    if (thenMatch) go('match', { applicantId: id });
  };

  return (
    <Modal
      title={isNew ? '入居希望者を登録' : '希望条件を編集'}
      subtitle="必須条件は候補の絞り込みに、希望条件は並び順に使われます"
      onClose={onClose}
      wide
      footer={
        <>
          <button type="button" className="btn ghost" onClick={onClose}>キャンセル</button>
          <button type="button" className="btn ghost" onClick={() => save(false)}>保存</button>
          <button type="button" className="btn" onClick={() => save(true)}><Icon name="spark" size={16} />保存して施設を探す</button>
        </>
      }
    >
      <div className="form">
        <h4 className="form-sec">ご本人の情報</h4>
        <div className="form-grid four">
          <div className={`field span-2 ${errors.name ? 'has-error' : ''}`}>
            <label>氏名 <em>必須</em></label>
            <input className="input" value={a.name} onChange={(e) => set('name', e.target.value)} placeholder="例：田中 和子" />
            {errors.name && <small className="err">{errors.name}</small>}
          </div>
          <div className="field span-2">
            <label>フリガナ</label>
            <input className="input" value={a.kana} onChange={(e) => set('kana', e.target.value)} placeholder="タナカ カズコ" />
          </div>
          <div className={`field ${errors.age ? 'has-error' : ''}`}>
            <label>年齢</label>
            <input className="input" type="number" value={a.age} onChange={(e) => set('age', Number(e.target.value))} />
            {errors.age && <small className="err">{errors.age}</small>}
          </div>
          <div className="field">
            <label>性別</label>
            <select className="input" value={a.gender} onChange={(e) => set('gender', e.target.value)}><option>女性</option><option>男性</option><option>その他</option></select>
          </div>
          <div className="field span-2">
            <label>連絡先（ご家族・ケアマネ等）</label>
            <input className="input" value={a.contact} onChange={(e) => set('contact', e.target.value)} placeholder="長女 田中 様" />
          </div>
        </div>

        <h4 className="form-sec"><span className="req-dot" />必須条件 <small>すべて満たす施設だけが候補になります</small></h4>
        <div className="form-grid">
          <div className="field">
            <label>介護度</label>
            <select className="input" value={a.careLevel} onChange={(e) => set('careLevel', e.target.value)}>{CARE_LEVELS.map((c) => <option key={c}>{c}</option>)}</select>
          </div>
          <div className={`field ${errors.budget ? 'has-error' : ''}`}>
            <label>月額予算の上限 <b className="range-val">{yen(a.budget)}</b></label>
            <input type="range" min="80000" max="400000" step="5000" value={a.budget} onChange={(e) => set('budget', Number(e.target.value))} />
          </div>
          <label className="switch-row boxed"><span>生活保護を受給している</span><input type="checkbox" checked={a.welfare} onChange={(e) => set('welfare', e.target.checked)} /><i /></label>
          <label className="switch-row boxed"><span>認知症の診断がある</span><input type="checkbox" checked={a.dementia} onChange={(e) => set('dementia', e.target.checked)} /><i /></label>
        </div>
        <div className="field">
          <label>必要な医療ケア</label>
          <div className="chips">{MEDICAL.map((m) => <Chip key={m} active={a.medical.includes(m)} onClick={() => toggle('medical', m)}>{m}</Chip>)}</div>
        </div>

        <h4 className="form-sec"><span className="pref-dot" />希望条件 <small>一致するほど上位に表示されます</small></h4>
        <div className="field">
          <label>希望地域（複数可）</label>
          <div className="chips">{AREAS.map((x) => <Chip key={x} active={a.areas.includes(x)} onClick={() => toggle('areas', x)}>{x}</Chip>)}</div>
        </div>
        <div className="field">
          <label>希望の施設種別（未選択＝指定なし）</label>
          <div className="chips">{TYPES.map((t) => <Chip key={t} active={a.types.includes(t)} onClick={() => toggle('types', t)}>{TYPE_SHORT[t]}</Chip>)}</div>
        </div>

        <h4 className="form-sec">対応状況</h4>
        <div className="form-grid four">
          <div className="field">
            <label>入居希望時期</label>
            <select className="input" value={a.moveIn} onChange={(e) => set('moveIn', e.target.value)}>{['退院後すぐ', '1か月以内', '3か月以内', '半年以内', '未定'].map((x) => <option key={x}>{x}</option>)}</select>
          </div>
          <div className="field">
            <label>ステータス</label>
            <select className="input" value={a.status} onChange={(e) => set('status', e.target.value)}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
          </div>
          <div className="field span-2">
            <label>担当相談員</label>
            <select className="input" value={a.assignee} onChange={(e) => set('assignee', e.target.value)} disabled={user.role !== 'admin'}>
              {USERS.filter((u) => u.role === 'staff').map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <div className="field span-4">
            <label>メモ</label>
            <textarea className="input" rows="2" value={a.note} onChange={(e) => set('note', e.target.value)} placeholder="ご家族の意向、退院予定日など" />
          </div>
        </div>
      </div>
    </Modal>
  );
}
