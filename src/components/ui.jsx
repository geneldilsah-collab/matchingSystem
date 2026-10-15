import { useEffect } from 'react';
import Icon from './Icon';
import { TYPE_SHORT } from '../data';

export function Modal({ title, subtitle, onClose, children, wide = false, footer }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal-backdrop" onClick={onClose} />
      <div className={`modal-panel ${wide ? 'wide' : ''}`}>
        <header className="modal-head">
          <div>
            <h3>{title}</h3>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button className="icon-btn" type="button" onClick={onClose} aria-label="閉じる"><Icon name="x" /></button>
        </header>
        <div className="modal-body">{children}</div>
        {footer && <footer className="modal-foot">{footer}</footer>}
      </div>
    </div>
  );
}

export function TypeBadge({ type }) {
  return <span className={`type-badge t-${TYPE_SHORT[type]}`}>{TYPE_SHORT[type]}</span>;
}

export function VacancyPill({ n }) {
  if (n === 0) return <span className="pill pill-gray">満室</span>;
  return <span className={`pill ${n >= 3 ? 'pill-green' : 'pill-amber'}`}>空室 {n}</span>;
}

export function Chip({ active, children, onClick }) {
  return (
    <button type="button" className={`chip ${active ? 'is-active' : ''}`} onClick={onClick}>
      {active && <Icon name="check" size={13} stroke={3} />}
      {children}
    </button>
  );
}

export function ScoreRing({ score, size = 64 }) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  const tone = score >= 80 ? 'var(--green)' : score >= 55 ? 'var(--primary)' : 'var(--amber)';
  return (
    <div className="score-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--line)" strokeWidth="6" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={tone}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - score / 100)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span><b>{score}</b><small>点</small></span>
    </div>
  );
}

export function FacilityThumb({ facility, size = 'md' }) {
  return (
    <div className={`thumb thumb-${size}`} style={{ '--h': facility.hue }}>
      <Icon name="building" size={size === 'lg' ? 34 : 22} stroke={1.6} />
    </div>
  );
}

export function Empty({ icon = 'search', title, text }) {
  return (
    <div className="empty">
      <div className="empty-icon"><Icon name={icon} size={26} /></div>
      <b>{title}</b>
      {text && <p>{text}</p>}
    </div>
  );
}
