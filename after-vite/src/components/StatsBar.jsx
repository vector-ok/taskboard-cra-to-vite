import _ from 'lodash';
import { COLUMNS } from '../theme';
import './StatsBar.css';

export default function StatsBar({ tasks }) {
  const counts = _.countBy(tasks, 'column');
  const total = tasks.length || 1;
  const done = counts.done || 0;

  return (
    <section className="stats">
      <div className="stats__summary">
        <span className="stats__number">{tasks.length}</span>
        <span className="stats__label">tasks tracked</span>
      </div>
      <div className="stats__bars">
        {COLUMNS.map((column) => {
          const value = counts[column.id] || 0;
          const width = `${Math.round((value / total) * 100)}%`;
          return (
            <div className="stats__row" key={column.id}>
              <span className="stats__row-label">{column.title}</span>
              <span className="stats__track">
                <span className="stats__fill" style={{ width }} />
              </span>
              <span className="stats__row-value">{value}</span>
            </div>
          );
        })}
      </div>
      <div className="stats__summary">
        <span className="stats__number">{Math.round((done / total) * 100)}%</span>
        <span className="stats__label">complete</span>
      </div>
    </section>
  );
}
