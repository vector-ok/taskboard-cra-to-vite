import { PRIORITIES } from '../theme';
import './FilterBar.css';

export default function FilterBar({ query, priority, onQuery, onPriority, onClose }) {
  return (
    <div className="filter">
      <input
        className="filter__input"
        value={query}
        placeholder="Search title or assignee…"
        onChange={(event) => onQuery(event.target.value)}
      />
      <select
        className="filter__select"
        value={priority}
        onChange={(event) => onPriority(event.target.value)}
      >
        <option value="">All priorities</option>
        {PRIORITIES.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <button className="btn btn--ghost" onClick={onClose} type="button">
        Done
      </button>
    </div>
  );
}
