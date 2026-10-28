import { relativeTime } from '../utils/format';
import './ActivityFeed.css';

export default function ActivityFeed({ entries }) {
  return (
    <aside className="activity">
      <h2 className="activity__title">Activity</h2>
      {entries.length === 0 ? (
        <p className="activity__empty">No activity yet.</p>
      ) : (
        <ul className="activity__list">
          {entries.map((entry) => (
            <li className="activity__item" key={entry.id}>
              <span className="activity__dot" />
              <span className="activity__text">{entry.text}</span>
              <span className="activity__time">{relativeTime(entry.at)}</span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
