import Card from './Card';
import EmptyState from './EmptyState';
import './Column.css';

export default function Column({ column, tasks, onMove, onDelete }) {
  return (
    <section className="column">
      <header className="column__head">
        <h2 className="column__title">{column.title}</h2>
        <span className="column__count">{tasks.length}</span>
      </header>
      <div className="column__body">
        {tasks.length === 0 ? (
          <EmptyState label="Nothing here yet" />
        ) : (
          tasks.map((task) => (
            <Card key={task.id} task={task} onMove={onMove} onDelete={onDelete} />
          ))
        )}
      </div>
    </section>
  );
}
