import './EmptyState.css';

export default function EmptyState({ label }) {
  return (
    <div className="empty">
      <span className="empty__icon" aria-hidden="true">◇</span>
      <p className="empty__label">{label}</p>
    </div>
  );
}
