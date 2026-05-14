// ── Category colours ──────────────────────────────────────────────
const CAT_COLORS = {
  Personal: '#f2a5b8',
  Work:     '#a5c8e8',
  Health:   '#a8d8b0',
  Ideas:    '#f0e08a',
};

// ── State ─────────────────────────────────────────────────────────
let tasks        = JSON.parse(localStorage.getItem('doable_tasks') || '[]');
let activeFilter = 'All';
let activeCat    = 'Personal';

// ── Category dot selector ─────────────────────────────────────────
document.querySelectorAll('.dot[data-cat]').forEach(dot => {
  dot.addEventListener('click', () => {
    document.querySelectorAll('.dot[data-cat]').forEach(d => d.classList.remove('active'));
    dot.classList.add('active');
    activeCat = dot.dataset.cat;
  });
});

// ── Add task ──────────────────────────────────────────────────────
function addTask() {
  const input = document.getElementById('task-input');
  const val   = input.value.trim();
  if (!val) return;

  tasks.push({ id: Date.now(), text: val, cat: activeCat, done: false });
  save();
  input.value = '';
  render();
}

document.getElementById('add-btn').addEventListener('click', addTask);
document.getElementById('task-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask();
});

// ── Filter buttons ────────────────────────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    render();
  });
});

// ── Persist ───────────────────────────────────────────────────────
function save() {
  localStorage.setItem('doable_tasks', JSON.stringify(tasks));
}

// ── Header copy ───────────────────────────────────────────────────
function updateHeader() {
  const total    = tasks.length;
  const done     = tasks.filter(t => t.done).length;
  const greeting = document.getElementById('greeting');
  const sub      = document.getElementById('sub');

  if (total === 0) {
    greeting.textContent = 'Today, gently.';
    sub.textContent      = 'All clear. Take a breath.';
  } else if (done === total) {
    greeting.textContent = 'All done. ✦';
    sub.textContent      = 'You did it. Rest a little.';
  } else {
    const left           = total - done;
    greeting.textContent = `${left} thing${left > 1 ? 's' : ''} left.`;
    sub.textContent      = "You've got this.";
  }
}

// ── Render ────────────────────────────────────────────────────────
function render() {
  const wrap     = document.getElementById('tasks-wrap');
  const filtered = activeFilter === 'All'
    ? tasks
    : tasks.filter(t => t.cat === activeFilter);

  wrap.innerHTML = '';

  if (filtered.length === 0) {
    wrap.innerHTML = `<div class="empty-state">Nothing here yet. Add your first task above.</div>`;
  } else {
    filtered.forEach(task => {
      const div       = document.createElement('div');
      div.className   = 'task-item' + (task.done ? ' done' : '');
      const checkBg   = task.done ? `background:${CAT_COLORS[task.cat]}` : '';

      div.innerHTML = `
        <div class="task-check${task.done ? ' checked' : ''}"
             data-id="${task.id}"
             style="${checkBg}">
          <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
            <path d="M1 4L4 7.5L10 1"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="task-label">${escHtml(task.text)}</span>
        <span class="task-cat-dot" style="background:${CAT_COLORS[task.cat]}"></span>
        <button class="task-del" data-id="${task.id}" title="Delete">×</button>
      `;

      wrap.appendChild(div);
    });
  }

  // Attach events to newly rendered elements
  wrap.querySelectorAll('.task-check').forEach(check => {
    check.addEventListener('click', () => {
      const task = tasks.find(x => x.id == check.dataset.id);
      if (task) { task.done = !task.done; save(); render(); }
    });
  });

  wrap.querySelectorAll('.task-del').forEach(btn => {
    btn.addEventListener('click', () => {
      tasks = tasks.filter(x => x.id != btn.dataset.id);
      save();
      render();
    });
  });

  updateHeader();
}

// ── Helpers ───────────────────────────────────────────────────────
function escHtml(str) {
  return str
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;');
}

// ── Init ──────────────────────────────────────────────────────────
render();

  