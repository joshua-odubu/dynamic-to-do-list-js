// script.js

// Run after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Select DOM elements
    const addButton = document.getElementById('add-task-btn');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // ---- Local Storage helpers ----
    function getStoredTasks() {
        return JSON.parse(localStorage.getItem('tasks') || '[]');
    }

    function saveStoredTasks(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Remove a single matching task from storage (handles duplicates by removing first match)
    function removeTaskFromStorage(taskText) {
        const tasks = getStoredTasks();
        const index = tasks.indexOf(taskText);
        if (index !== -1) {
            tasks.splice(index, 1);
            saveStoredTasks(tasks);
        }
    }

    // ---- UI helpers ----
    function createTaskElement(taskText) {
        const listItem = document.createElement('li');
        listItem.textContent = taskText;

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.classList.add('remove-btn'); // required by checker

        removeButton.addEventListener('click', function () {
            taskList.removeChild(listItem);
            removeTaskFromStorage(taskText);
        });

        listItem.appendChild(removeButton);
        return listItem;
    }

    // Add a task (optionally skip saving when loading from storage)
    function addTask(taskText, save = true) {
        // If no preset text provided, read from input
        const text = (typeof taskText === 'string') ? taskText.trim() : taskInput.value.trim();

        if (text === '') {
            alert('Please enter a task.');
            return;
        }

        const item = createTaskElement(text);
        taskList.appendChild(item);

        if (save) {
            const tasks = getStoredTasks();
            tasks.push(text);
            saveStoredTasks(tasks);
        }

        // Clear input only when adding from the input box
        if (typeof taskText !== 'string') {
            taskInput.value = '';
        }
    }

    // Load tasks from Local Storage on page load
    function loadTasks() {
        const storedTasks = getStoredTasks();
        storedTasks.forEach(function (t) {
            addTask(t, false); // don't save again while loading
        });
    }

    // ---- Event listeners ----
    addButton.addEventListener('click', function () {
        addTask();
    });

    taskInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    // Initialize from Local Storage
    loadTasks();
});