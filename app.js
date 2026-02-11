const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const categorySelect = document.getElementById('category-select');
const emptyState = document.getElementById('empty-state');
const dateDisplay = document.getElementById('date-display');

// Display current date
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
if (dateDisplay) {
    dateDisplay.textContent = new Date().toLocaleDateString('zh-TW', options);
}

document.addEventListener('DOMContentLoaded', loadTodos);

addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});

todoList.addEventListener('click', handleTaskAction);

function addTodo() {
    const taskText = todoInput.value.trim();
    const category = categorySelect.value;

    if (taskText === '') return;

    const todo = {
        id: Date.now(),
        text: taskText,
        category: category,
        completed: false
    };

    createTodoElement(todo);
    saveLocalTodo(todo);

    todoInput.value = '';
}

function createTodoElement(todo) {
    const li = document.createElement('li');
    li.classList.add('todo-item');
    if (todo.completed) li.classList.add('completed');
    li.dataset.id = todo.id;

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('todo-content');

    const checkboxWrapper = document.createElement('div');
    checkboxWrapper.classList.add('checkbox-wrapper');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('custom-checkbox');
    checkbox.checked = todo.completed;
    checkboxWrapper.appendChild(checkbox);

    const span = document.createElement('span');
    span.innerText = todo.text;
    span.classList.add('task-text');

    contentDiv.appendChild(checkboxWrapper);
    contentDiv.appendChild(span);

    const rightDiv = document.createElement('div');
    rightDiv.style.display = 'flex';
    rightDiv.style.alignItems = 'center';

    const categoryTag = document.createElement('span');
    categoryTag.classList.add('tag', todo.category);
    categoryTag.innerText = todo.category === 'work' ? '工作' : '生活';

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>';
    deleteBtn.classList.add('delete-btn');

    rightDiv.appendChild(categoryTag);
    rightDiv.appendChild(deleteBtn);

    li.appendChild(contentDiv);
    li.appendChild(rightDiv);

    todoList.prepend(li);
    checkEmptyState();
}

function handleTaskAction(e) {
    const item = e.target.closest('.todo-item');
    if (!item) return;

    // Delete
    if (e.target.closest('.delete-btn')) {
        item.style.opacity = '0';
        item.style.transform = 'translateY(10px)';
        item.addEventListener('transitionend', () => {
            if (item.parentNode) {
                removeLocalTodo(item.dataset.id);
                item.remove();
                checkEmptyState();
            }
        }, { once: true }); // Ensure it runs only once
    }

    // Check
    if (e.target.classList.contains('custom-checkbox')) {
        item.classList.toggle('completed');
        updateLocalTodoStatus(item.dataset.id);
    }
}

function checkEmptyState() {
    if (todoList.children.length === 0) {
        emptyState.classList.add('visible');
    } else {
        emptyState.classList.remove('visible');
    }
}

function saveLocalTodo(todo) {
    let todos = getLocalTodos();
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
    let todos = getLocalTodos();
    todoList.innerHTML = '';
    todos.forEach(todo => {
        createTodoElement(todo);
    });
    checkEmptyState();
}

function removeLocalTodo(id) {
    let todos = getLocalTodos();
    todos = todos.filter(todo => todo.id !== Number(id));
    localStorage.setItem('todos', JSON.stringify(todos));
}

function updateLocalTodoStatus(id) {
    let todos = getLocalTodos();
    const todoIndex = todos.findIndex(t => t.id === Number(id));
    if (todoIndex > -1) {
        todos[todoIndex].completed = !todos[todoIndex].completed;
        localStorage.setItem('todos', JSON.stringify(todos));
    }
}

function getLocalTodos() {
    return localStorage.getItem('todos') === null ? [] : JSON.parse(localStorage.getItem('todos'));
}
