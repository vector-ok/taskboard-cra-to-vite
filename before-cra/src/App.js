import { useCallback, useMemo, useState } from 'react';
import _ from 'lodash';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import Board from './components/Board';
import ActivityFeed from './components/ActivityFeed';
import FilterBar from './components/FilterBar';
import Modal from './components/Modal';
import CardForm from './components/CardForm';
import { useLocalStorage } from './hooks/useLocalStorage';
import { seedTasks } from './data/seed';
import { COLUMNS } from './theme';
import './App.css';

const BOARD_TITLE = process.env.REACT_APP_BOARD_TITLE || 'TaskBoard';

export default function App() {
  const [tasks, setTasks] = useLocalStorage('taskboard.tasks', seedTasks);
  const [entries, setEntries] = useLocalStorage('taskboard.activity', []);
  const [showForm, setShowForm] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [query, setQuery] = useState('');
  const [priority, setPriority] = useState('');

  const log = useCallback(
    (text) => {
      setEntries((current) =>
        [{ id: `entry-${Date.now()}-${Math.random().toString(16).slice(2)}`, text, at: Date.now() }]
          .concat(current)
          .slice(0, 12)
      );
    },
    [setEntries]
  );

  const move = useCallback(
    (id, direction) => {
      setTasks((current) =>
        current.map((task) => {
          if (task.id !== id) return task;
          const index = _.findIndex(COLUMNS, { id: task.column });
          const nextIndex = _.clamp(index + direction, 0, COLUMNS.length - 1);
          if (nextIndex === index) return task;
          log(`Moved "${task.title}" to ${COLUMNS[nextIndex].title}`);
          return { ...task, column: COLUMNS[nextIndex].id };
        })
      );
    },
    [setTasks, log]
  );

  const remove = useCallback(
    (id) => {
      setTasks((current) => current.filter((task) => task.id !== id));
      log('Deleted a task');
    },
    [setTasks, log]
  );

  const create = useCallback(
    (task) => {
      setTasks((current) => [task, ...current]);
      log(`Created "${task.title}"`);
      setShowForm(false);
    },
    [setTasks, log]
  );

  const filtered = useMemo(() => {
    return tasks.filter((task) => !priority || task.priority === priority);
  }, [tasks, priority]);

  return (
    <div className="app">
      <Header
        title={BOARD_TITLE}
        onOpenForm={() => setShowForm(true)}
        onToggleFilter={() => setShowFilter((value) => !value)}
      />
      {showFilter && (
        <FilterBar
          query={query}
          priority={priority}
          onQuery={setQuery}
          onPriority={setPriority}
          onClose={() => setShowFilter(false)}
        />
      )}
      <StatsBar tasks={tasks} />
      <main className="app__main">
        <Board tasks={filtered} query={query} onMove={move} onDelete={remove} />
        <ActivityFeed entries={entries} />
      </main>
      {showForm && (
        <Modal title="New task" onClose={() => setShowForm(false)}>
          <CardForm onSubmit={create} onCancel={() => setShowForm(false)} />
        </Modal>
      )}
    </div>
  );
}
