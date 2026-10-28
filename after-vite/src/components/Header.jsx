import './Header.css';

export default function Header({ title, onOpenForm, onToggleFilter }) {
  return (
    <header className="header">
      <div className="header__brand">
        <span className="header__mark" aria-hidden="true" />
        <h1 className="header__title">{title}</h1>
      </div>
      <div className="header__actions">
        <button className="btn btn--ghost" onClick={onToggleFilter} type="button">
          Filter
        </button>
        <button className="btn btn--primary" onClick={onOpenForm} type="button">
          New task
        </button>
      </div>
    </header>
  );
}
