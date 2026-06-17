(function() {
  'use strict';

  const STORAGE_KEY = 'taskflow_tasks';
  const THEME_KEY = 'taskflow_theme';

  let tasks = [];
  let currentFilter = 'all';
  let searchQuery = '';
  let editingTaskId = null;
  let deletedTask = null;
  let draggedTask = null;
  let theme = 'light';

  const elements = {
    themeToggle: document.getElementById('themeToggle'),
    addTaskBtn: document.getElementById('addTaskBtn'),
    taskForm: document.getElementById('taskForm'),
    formTitle: document.getElementById('formTitle'),
    closeFormBtn: document.getElementById('closeFormBtn'),
    taskTitle: document.getElementById('taskTitle'),
    taskCategory: document.getElementById('taskCategory'),
    taskDueDate: document.getElementById('taskDueDate'),
    cancelBtn: document.getElementById('cancelBtn'),
    saveBtn: document.getElementById('saveBtn'),
    searchInput: document.getElementById('searchInput'),
    taskList: document.getElementById('taskList'),
    taskListContainer: document.getElementById('taskListContainer'),
    emptyState: document.getElementById('emptyState'),
    totalCount: document.getElementById('totalCount'),
    activeCount: document.getElementById('activeCount'),
    completedCount: document.getElementById('completedCount'),
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toastMessage'),
    undoBtn: document.getElementById('undoBtn'),
    filterPills: document.querySelectorAll('.filter-pill'),
    priorityBtns: document.querySelectorAll('.priority-btn')
  };

  function init() {
    loadTheme();
    loadTasks();
    attachEventListeners();
    renderTasks();
    updateStats();
  }

  function generateId() {
    return 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  function loadTheme() {
    chrome.storage.local.get(THEME_KEY, (result) => {
      theme = result[THEME_KEY] || 'light';
      document.documentElement.setAttribute('data-theme', theme);
    });
  }

  function saveTheme() {
    chrome.storage.local.set({ [THEME_KEY]: theme });
  }

  function toggleTheme() {
    theme = theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    saveTheme();
  }

  function loadTasks() {
    chrome.storage.local.get(STORAGE_KEY, (result) => {
      try {
        tasks = result[STORAGE_KEY] || [];
        if (!Array.isArray(tasks)) {
          tasks = [];
        }
      } catch (e) {
        tasks = [];
      }
    });
  }

  function saveTasks() {
    chrome.storage.local.set({ [STORAGE_KEY]: tasks }, () => {
      if (chrome.runtime.lastError) {
        console.error('Storage error:', chrome.runtime.lastError);
      }
    });
  }

  function attachEventListeners() {
    elements.themeToggle.addEventListener('click', toggleTheme);
    elements.addTaskBtn.addEventListener('click', openAddForm);
    elements.closeFormBtn.addEventListener('click', closeForm);
    elements.cancelBtn.addEventListener('click', closeForm);
    elements.saveBtn.addEventListener('click', saveTask);
    elements.searchInput.addEventListener('input', handleSearch);
    elements.taskTitle.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') saveTask();
    });

    elements.filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        elements.filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentFilter = pill.dataset.category;
        renderTasks();
      });
    });

    elements.priorityBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        elements.priorityBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    elements.undoBtn.addEventListener('click', undoDelete);

    elements.taskListContainer.addEventListener('dragover', handleDragOver);
    elements.taskListContainer.addEventListener('drop', handleDrop);
  }

  function openAddForm() {
    editingTaskId = null;
    elements.formTitle.textContent = 'New Task';
    elements.taskTitle.value = '';
    elements.taskCategory.value = 'personal';
    elements.taskDueDate.value = '';
    elements.priorityBtns.forEach(b => b.classList.remove('active'));
    elements.priorityBtns[1].classList.add('active');
    elements.taskForm.classList.add('active');
    elements.taskTitle.focus();
  }

  function openEditForm(task) {
    editingTaskId = task.id;
    elements.formTitle.textContent = 'Edit Task';
    elements.taskTitle.value = task.title;
    elements.taskCategory.value = task.category;
    elements.taskDueDate.value = task.dueDate || '';

    elements.priorityBtns.forEach(b => b.classList.remove('active'));
    const priorityBtn = document.querySelector(`.priority-btn[data-priority="${task.priority}"]`);
    if (priorityBtn) priorityBtn.classList.add('active');

    elements.taskForm.classList.add('active');
    elements.taskTitle.focus();
  }

  function closeForm() {
    elements.taskForm.classList.remove('active');
    editingTaskId = null;
    elements.taskTitle.classList.remove('input-error');
    const errorMsg = document.querySelector('.error-message');
    if (errorMsg) errorMsg.remove();
  }

  function saveTask() {
    const title = elements.taskTitle.value.trim();

    if (!title) {
      elements.taskTitle.classList.add('input-error');
      let errorMsg = document.querySelector('.error-message');
      if (!errorMsg) {
        errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        elements.taskTitle.parentNode.insertBefore(errorMsg, elements.taskTitle.nextSibling);
      }
      errorMsg.textContent = 'Please enter a task title';
      elements.taskTitle.focus();
      return;
    }

    elements.taskTitle.classList.remove('input-error');
    const errorMsg = document.querySelector('.error-message');
    if (errorMsg) errorMsg.remove();

    const activePriority = document.querySelector('.priority-btn.active');
    const priority = activePriority ? activePriority.dataset.priority : 'medium';

    if (editingTaskId) {
      const taskIndex = tasks.findIndex(t => t.id === editingTaskId);
      if (taskIndex !== -1) {
        tasks[taskIndex] = {
          ...tasks[taskIndex],
          title: title,
          category: elements.taskCategory.value,
          priority: priority,
          dueDate: elements.taskDueDate.value || null,
          updatedAt: Date.now()
        };
      }
    } else {
      const newTask = {
        id: generateId(),
        title: title,
        category: elements.taskCategory.value,
        priority: priority,
        dueDate: elements.taskDueDate.value || null,
        completed: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        order: tasks.length
      };
      tasks.unshift(newTask);
    }

    saveTasks();
    renderTasks();
    updateStats();
    closeForm();
  }

  function toggleTaskComplete(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      task.updatedAt = Date.now();
      saveTasks();
      renderTasks();
      updateStats();
    }
  }

  function deleteTask(taskId) {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      deletedTask = { task: tasks[taskIndex], index: taskIndex };
      tasks.splice(taskIndex, 1);
      saveTasks();
      renderTasks();
      updateStats();
      showToast('Task deleted');
    }
  }

  function undoDelete() {
    if (deletedTask) {
      tasks.splice(deletedTask.index, 0, deletedTask.task);
      saveTasks();
      renderTasks();
      updateStats();
      hideToast();
      deletedTask = null;
    }
  }

  function handleSearch(e) {
    searchQuery = e.target.value.toLowerCase().trim();
    renderTasks();
  }

  function getFilteredTasks() {
    let filtered = [...tasks];

    if (currentFilter !== 'all') {
      filtered = filtered.filter(t => t.category === currentFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(searchQuery)
      );
    }

    const active = filtered.filter(t => !t.completed);
    const completed = filtered.filter(t => t.completed);

    return [...active, ...completed];
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dateOnly = new Date(date);
    dateOnly.setHours(0, 0, 0, 0);

    if (dateOnly.getTime() === today.getTime()) {
      return 'Today';
    } else if (dateOnly.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    } else if (dateOnly < today) {
      const days = Math.floor((today - dateOnly) / (1000 * 60 * 60 * 24));
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function isOverdue(dateStr) {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  }

  function renderTasks() {
    const filtered = getFilteredTasks();

    if (filtered.length === 0) {
      elements.taskList.innerHTML = '';
      elements.emptyState.classList.add('active');
      return;
    }

    elements.emptyState.classList.remove('active');

    elements.taskList.innerHTML = filtered.map(task => {
      const overdueClass = task.dueDate && isOverdue(task.dueDate) ? 'overdue' : '';
      const completedClass = task.completed ? 'completed' : '';

      return `
        <div class="task-card ${completedClass}" draggable="true" data-id="${task.id}">
          <div class="checkbox-container">
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
            <svg class="checkmark" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div class="task-content">
            <div class="task-title">${escapeHtml(task.title)}</div>
            <div class="task-meta">
              <span class="category-badge ${task.category}">${task.category}</span>
              <span class="priority-indicator ${task.priority}">
                <span class="dot"></span>
                ${task.priority}
              </span>
              ${task.dueDate ? `
                <span class="due-date ${overdueClass}">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  ${formatDate(task.dueDate)}
                </span>
              ` : ''}
            </div>
          </div>
          <div class="task-actions">
            <button class="action-btn edit" data-id="${task.id}" aria-label="Edit task">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button class="action-btn delete" data-id="${task.id}" aria-label="Delete task">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
      `;
    }).join('');

    attachTaskEventListeners();
  }

  function attachTaskEventListeners() {
    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        e.stopPropagation();
        toggleTaskComplete(e.target.dataset.id);
      });
    });

    document.querySelectorAll('.action-btn.edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const task = tasks.find(t => t.id === btn.dataset.id);
        if (task) openEditForm(task);
      });
    });

    document.querySelectorAll('.action-btn.delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = btn.closest('.task-card');
        card.classList.add('removing');
        setTimeout(() => {
          deleteTask(btn.dataset.id);
        }, 150);
      });
    });

    document.querySelectorAll('.task-card').forEach(card => {
      card.addEventListener('dragstart', handleDragStart);
      card.addEventListener('dragend', handleDragEnd);
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function updateStats() {
    const total = tasks.length;
    const active = tasks.filter(t => !t.completed).length;
    const completed = tasks.filter(t => t.completed).length;

    elements.totalCount.textContent = total;
    elements.activeCount.textContent = active;
    elements.completedCount.textContent = completed;
  }

  function showToast(message) {
    elements.toastMessage.textContent = message;
    elements.toast.classList.add('show');

    setTimeout(() => {
      hideToast();
    }, 4000);
  }

  function hideToast() {
    elements.toast.classList.remove('show');
    deletedTask = null;
  }

  function handleDragStart(e) {
    draggedTask = e.target;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    draggedTask = null;
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    const afterElement = getDragAfterElement(elements.taskList, e);
    const container = elements.taskList;

    if (afterElement == null) {
      container.appendChild(draggedTask);
    } else {
      container.insertBefore(draggedTask, afterElement);
    }
  }

  function handleDrop(e) {
    e.preventDefault();

    const cardElements = Array.from(elements.taskList.children);
    const newOrder = cardElements.map(card => card.dataset.id);

    const reorderedTasks = [];
    newOrder.forEach(id => {
      const task = tasks.find(t => t.id === id);
      if (task) reorderedTasks.push(task);
    });

    const remaining = tasks.filter(t => !newOrder.includes(t.id));
    tasks = [...reorderedTasks, ...remaining];

    tasks.forEach((task, index) => {
      task.order = index;
    });

    saveTasks();
  }

  function getDragAfterElement(container, e) {
    const draggableElements = [...container.querySelectorAll('.task-card:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = e.clientY - box.top - box.height / 2;

      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }

  document.addEventListener('DOMContentLoaded', init);
})();