import { useState } from 'react';
import Icon from '../components/Icon';
import { Chip, Modal } from '../components/ui';
import { AREAS, CARE_LEVELS, DEMO_TODAY, MEDICAL, TYPES } from '../data';

const blank = {
  name: '', type: TYPES[1], area: AREAS[0], address: '', tel: '', careLevels: ['要介護1', '要介護2', '要介護3'],
  monthly: 150000, entryFee: 0, welfare: false, dementia: false, medical: [], rooms: 30, vacancy: 0, features: []
};

export default function FacilityForm({ ctx, facility, onClose }) {
  const { update, toast, user } = ctx;
  const isNew = !facility;
  const [f, setF] = useState(() => (facility ? { ...facility, featuresText: facility.features.join('、') } : { ...blank, featuresText: '' }));
  const [errors, setErrors] = useState({});
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const toggle = (k, v) => setF((s) => ({ ...s, [k]: s[k].includes(v) ? s[k].filter((x) => x !== v) : [...s[k], v] }));
  const lockBasic = user.role === 'facility';

  const save = () => {
    const e = {};
    if (!f.name.trim()) e.name = '施設名を入力してください';
    if (!f.address.trim()) e.address = '所在地を入力してください';
    if (f.careLevels.length === 0) e.careLevels = '1つ以上選択してください';
    if (!(f.monthly > 0)) e.monthly = '月額費用を入力してください';
    if (f.vacancy > f.rooms) e.vacancy = '空室数が定員を超えています';
    setErrors(e);
    if (Object.keys(e).length) {
      toast('入力内容を確認してください', 'warn');
      return;
    }
    const careLevels = CARE_LEVELS.filter((c) => f.careLevels.includes(c));
    const record = { ...f, careLevels, features: f.featuresText.split(/[、,]/).map((s) => s.trim()).filter(Boolean), updatedAt: DEMO_TODAY };
    delete record.featuresText;
    if (isNew) {
      const id = `F${String(Date.now()).slice(-4)}`;
      update('facilities', (list) => [{ ...record, id, hue: Math.floor(Math.random() * 360) }, ...list]);
      toast(`「${record.name}」を登録しました`);
    } else {
      update('facilities', (list) => list.map((x) => (x.id === facility.id ? { ...x, ...record } : x)));
      toast('施設情報を更新しました');
    }
    onClose();
  };

  return (
    <Modal
      title={isNew ? '施設を登録' : '施設情報を編集'}
      subtitle={isNew ? '基本情報・受け入れ条件・空室状況を登録します' : facility.name}
      onClose={onClose}
      wide
      footer={<><button type="button" className="btn ghost" onClick={onClose}>キャンセル</button><button type="button" className="btn" onClick={save}><Icon name="check" size={16} />保存する</button></>}
    >
      <div className="form">
        <h4 className="form-sec">基本情報</h4>
        <div className="form-grid">
          <div className={`field span-2 ${errors.name ? 'has-error' : ''}`}>
            <label>施設名 <em>必須</em></label>
            <input className="input" value={f.name} onChange={(e) => set('name', e.target.value)} disabled={lockBasic} placeholder="例：ひだまりの郷 世田谷" />
            {errors.name && <small className="err">{errors.name}</small>}
          </div>
          <div className="field">
            <label>施設種別</label>
            <select className="input" value={f.type} onChange={(e) => set('type', e.target.value)} disabled={lockBasic}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select>
          </div>
          <div className="field">
            <label>地域</label>
            <select className="input" value={f.area} onChange={(e) => set('area', e.target.value)} disabled={lockBasic}>{AREAS.map((a) => <option key={a}>{a}</option>)}</select>
          </div>
          <div className={`field span-2 ${errors.address ? 'has-error' : ''}`}>
            <label>所在地 <em>必須</em></label>
            <input className="input" value={f.address} onChange={(e) => set('address', e.target.value)} placeholder="例：東京都世田谷区…" />
            {errors.address && <small className="err">{errors.address}</small>}
          </div>
          <div className="field">
            <label>電話番号</label>
            <input className="input" value={f.tel} onChange={(e) => set('tel', e.target.value)} placeholder="03-0000-0000" />
          </div>
          <div className="field">
            <label>特徴（読点区切り）</label>
            <input className="input" value={f.featuresText} onChange={(e) => set('featuresText', e.target.value)} placeholder="駅徒歩5分、個室あり" />
          </div>
        </div>

        <h4 className="form-sec">受け入れ条件</h4>
        <div className={`field ${errors.careLevels ? 'has-error' : ''}`}>
          <label>受け入れ可能な介護度 <em>必須</em></label>
          <div className="chips">{CARE_LEVELS.map((c) => <Chip key={c} active={f.careLevels.includes(c)} onClick={() => toggle('careLevels', c)}>{c}</Chip>)}</div>
          {errors.careLevels && <small className="err">{errors.careLevels}</small>}
        </div>
        <div className="field">
          <label>対応可能な医療ケア</label>
          <div className="chips">{MEDICAL.map((m) => <Chip key={m} active={f.medical.includes(m)} onClick={() => toggle('medical', m)}>{m}</Chip>)}</div>
        </div>
        <div className="form-grid">
          <label className="switch-row boxed"><span>生活保護の方を受け入れ可能</span><input type="checkbox" checked={f.welfare} onChange={(e) => set('welfare', e.target.checked)} /><i /></label>
          <label className="switch-row boxed"><span>認知症の方を受け入れ可能</span><input type="checkbox" checked={f.dementia} onChange={(e) => set('dementia', e.target.checked)} /><i /></label>
        </div>

        <h4 className="form-sec">費用・空室</h4>
        <div className="form-grid four">
          <div className={`field ${errors.monthly ? 'has-error' : ''}`}>
            <label>月額目安（円）</label>
            <input className="input" type="number" min="0" step="1000" value={f.monthly} onChange={(e) => set('monthly', Number(e.target.value))} />
            {errors.monthly && <small className="err">{errors.monthly}</small>}
          </div>
          <div className="field">
            <label>入居一時金（円）</label>
            <input className="input" type="number" min="0" step="10000" value={f.entryFee} onChange={(e) => set('entryFee', Number(e.target.value))} />
          </div>
          <div className="field">
            <label>定員（室）</label>
            <input className="input" type="number" min="1" value={f.rooms} onChange={(e) => set('rooms', Number(e.target.value))} />
          </div>
          <div className={`field ${errors.vacancy ? 'has-error' : ''}`}>
            <label>空室数（室）</label>
            <input className="input" type="number" min="0" value={f.vacancy} onChange={(e) => set('vacancy', Number(e.target.value))} />
            {errors.vacancy && <small className="err">{errors.vacancy}</small>}
          </div>
        </div>
        {lockBasic && <p className="hint"><Icon name="lock" size={14} />施設名・種別・地域の変更は運営管理者へ依頼してください。</p>}
      </div>
    </Modal>
  );
}
