import { PRIORITY_COLORS } from '../theme';
import { dueLabel, initials, relativeTime } from '../utils/format';
import './Card.css';

export default function Card({ task, onMove, onDelete }) {
  const overdue = task.dueInDays < 0;

  return (
    <article className="card">
      <div className="card__top">
        <span
          className="card__priority"
          style={{ background: PRIORITY_COLORS[task.priority] }}
          title={`${task.priority} priority`}
        />
        <h3 className="card__title">{task.title}</h3>
      </div>
      <p className="card__desc">{task.description}</p>
      <div className="card__meta">
        <span className="card__avatar">{initials(task.assignee)}</span>
        <span className="card__assignee">{task.assignee}</span>
        <span className={overdue ? 'card__due card__due--late' : 'card__due'}>
          {dueLabel(task.dueInDays)}
        </span>
      </div>
      <div className="card__foot">
        <span className="card__age">{relativeTime(task.createdAt)}</span>
        <div className="card__controls">
          <button className="card__btn" onClick={() => onMove(task.id, -1)} type="button">
            ←
          </button>
          <button className="card__btn" onClick={() => onMove(task.id, 1)} type="button">
            →
          </button>
          <button
            className="card__btn card__btn--danger"
            onClick={() => onDelete(task.id)}
            type="button"
          >
            ×
          </button>
        </div>
      </div>
    </article>
  );
}
