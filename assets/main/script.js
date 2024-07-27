document.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector(".rounded-btn");
    const inputTodo = document.getElementById("todo_input");
    const icon = document.getElementById("icon");
    const number = document.querySelector(".count");
    const allBtn = document.querySelectorAll(".all_category");
    const activeBtn = document.querySelectorAll(".active_category");
    const completedBtn = document.querySelectorAll(".completed_category");
    const clearCompletedBtn = document.querySelector(".clear_completed");
    const todoListContainer = document.querySelector(".todoList_container");
    const categoryButton = document.querySelectorAll("h4");

    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let activeFilter = "all";

    const saveTodos = () => {
        localStorage.setItem('todos', JSON.stringify(todos));
    };

    const addTodo = (text) => {
        todos.push({ text, checked: false });
        saveTodos();
        updateTodoList();
    };

    const toggleChecked = (index) => {
        todos[index].checked = !todos[index].checked;
        saveTodos();
        updateTodoList();
    };

    const removeTodo = (index) => {
        todos.splice(index, 1);
        saveTodos();
        updateTodoList();
    };

    const updateItemsLeft = () => {
        const itemsLeft = todos.filter(todo => !todo.checked).length;
        number.textContent = itemsLeft;
    };

    const displayTodos = (filter) => {
        activeFilter = filter;
        todoListContainer.innerHTML = "";
        todos.forEach((todo, index) => {
            if (
                filter === "all" ||
                (filter === "done" && todo.checked) ||
                (filter === "undone" && !todo.checked)
            ) {
                const todoItem = document.createElement('div');
                todoItem.className = "todo-list_row";
                todoItem.innerHTML = `
                    <div class="todo-list">
                        <span class="check_btn" style="background: ${todo.checked ? "linear-gradient(to bottom, #55ddff 0%, #c058f3 100%)" : ""};">
                            <img src="assets/images/icon-check.svg" class="check_icon" style="display: ${todo.checked ? "block" : "none"}" alt="Check Icon">
                        </span>
                        <p class="todoText" style="color: ${todo.checked ? "var(--marked-state-CLR)" : ""}; text-decoration: ${todo.checked ? "line-through" : ""}">${todo.text}</p>
                    </div>
                    <img src="assets/images/icon-cross.svg" class="cancel_icon" alt="Cancel Icon">
                `;
                todoItem.querySelector('.check_btn').addEventListener('click', () => toggleChecked(index));
                todoItem.querySelector('.cancel_icon').addEventListener('click', () => removeTodo(index));
                todoListContainer.appendChild(todoItem);
            }
        });
    };

    const updateTodoList = () => {
        displayTodos(activeFilter);
        updateItemsLeft();
    };

    btn.addEventListener("click", (e) => {
        e.preventDefault();
        if (inputTodo.value.trim()) {
            addTodo(inputTodo.value.trim());
            inputTodo.value = "";
        }
    });

    inputTodo.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && inputTodo.value.trim()) {
            addTodo(inputTodo.value.trim());
            inputTodo.value = "";
        }
    });

    allBtn.forEach(button => button.addEventListener("click", () => displayTodos("all")));
    activeBtn.forEach(button => button.addEventListener("click", () => displayTodos("undone")));
    completedBtn.forEach(button => button.addEventListener("click", () => displayTodos("done")));

    clearCompletedBtn.addEventListener("click", () => {
        todos = todos.filter(todo => !todo.checked);
        saveTodos();
        updateTodoList();
    });

    categoryButton.forEach(button => {
        button.addEventListener("click", () => {
            categoryButton.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
        });
    });

    icon.addEventListener("click", () => {
        document.body.classList.toggle("light-theme");
        icon.src = document.body.classList.contains("light-theme") ? "assets/images/icon-moon.svg" : "assets/images/icon-sun.svg";
    });

    updateTodoList();

    // Initialize Sortable.js
    new Sortable(todoListContainer, {
        animation: 150,
        onEnd: (evt) => {
            const { oldIndex, newIndex } = evt;
            const movedItem = todos.splice(oldIndex, 1)[0];
            todos.splice(newIndex, 0, movedItem);
            saveTodos();
            updateTodoList();
        },
    });
});
