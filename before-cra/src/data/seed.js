const people = ['Amara', 'Tunde', 'Chiara', 'Ben', 'Nadia', 'Kofi'];
const titles = [
  'Fix sidebar overlap on tablet',
  'Add CSV export to reports',
  'Replace legacy date picker',
  'Investigate slow dashboard load',
  'Write migration guide for v3',
  'Tighten form validation copy',
  'Remove unused lodash imports',
  'Add empty state for search results',
  'Split settings page by section',
  'Upgrade chart library',
  'Add keyboard shortcuts',
  'Deduplicate API error handling',
];
const columns = ['backlog', 'progress', 'review', 'done'];
const priorities = ['low', 'medium', 'high', 'critical'];

export const seedTasks = titles.map((title, i) => ({
  id: `task-${i + 1}`,
  title,
  description: `Work item ${i + 1}. Needs scoping before implementation begins.`,
  column: columns[i % columns.length],
  priority: priorities[i % priorities.length],
  assignee: people[i % people.length],
  dueInDays: (i % 9) - 2,
  createdAt: Date.now() - i * 86400000,
}));
