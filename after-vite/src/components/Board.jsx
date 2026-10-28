import { useMemo } from 'react';
import _ from 'lodash';
import Column from './Column';
import { COLUMNS } from '../theme';
import './Board.css';

export default function Board({ tasks, query, onMove, onDelete }) {
  const visible = useMemo(() => {
    if (!query) return tasks;
    const needle = query.toLowerCase();
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(needle) ||
        task.assignee.toLowerCase().includes(needle)
    );
  }, [tasks, query]);

  const grouped = useMemo(() => _.groupBy(visible, 'column'), [visible]);

  return (
    <div className="board">
      {COLUMNS.map((column) => (
        <Column
          key={column.id}
          column={column}
          tasks={grouped[column.id] || []}
          onMove={onMove}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
