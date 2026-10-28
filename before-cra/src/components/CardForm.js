import { useState } from 'react';
import { COLUMNS, PRIORITIES } from '../theme';
import './CardForm.css';

export default function CardForm({ onSubmit, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState('');
  const [priority, setPriority] = useState('medium');
  const [column, setColumn] = useState('backlog');
  const valid = title.trim().length > 2 && assignee.trim().length > 0;

  function handleSubmit(event) {
    event.preventDefault();
    if (!valid) return;
    onSubmit({
      title: title.trim(),
      description: description.trim() || 'No description.',
      assignee: assignee.trim(),
      priority,
      column,
      dueInDays: 3,
      createdAt: Date.now(),
    });
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label className="form__field">
        <span className="form__label">Title</span>
        <input
          className="form__input"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What needs doing?"
        />
      </label>
      <label className="form__field">
        <span className="form__label">Description</span>
        <textarea
          className="form__input form__input--area"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={3}
        />
      </label>
      <div className="form__row">
        <label className="form__field">
          <span className="form__label">Assignee</span>
          <input
            className="form__input"
            value={assignee}
            onChange={(event) => setAssignee(event.target.value)}
            placeholder="Name"
          />
        </label>
        <label className="form__field">
          <span className="form__label">Priority</span>
          <select
            className="form__input"
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
          >
            {PRIORITIES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="form__field">
          <span className="form__label">Column</span>
          <select
            className="form__input"
            value={column}
            onChange={(event) => setColumn(event.target.value)}
          >
            {COLUMNS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.title}
              </option>
            ))}
          </select>
        </label>
      </div>
      <footer className="form__foot">
        <button className="btn btn--ghost" type="button" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn btn--primary" type="submit" disabled={!valid}>
          Create task
        </button>
      </footer>
    </form>
  );
}
