let todosBox = document.querySelector('.todosBox')
let todoHeading = document.querySelector('.todoHeading')
let operationBtn = document.querySelector('.operationBtn')
let todoInput = document.querySelector('.input');
let errorTxt = document.querySelector('.errorTxt')
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let editId;

let colorValuesBystatus = {
    "In progress":"blue",
    "Schedule":"black",
    "On hold":"orangered",
    "Completed":"green"
}

if (todos.length > 0) {
    renderTodos(todos)
    todoHeading.innerText = "My-ToDo's"
    hideShowTodoScroll()
}


function hideStatusMenus() {
    let statusMenus = document.querySelectorAll('.statusMenu')
    statusMenus.forEach(menu => menu.classList.add('hide'))
}
function hideShowTodoScroll() {
    if (todos.length > 3) {
        todosBox.style.overflowY = 'auto'
    }
    else todosBox.style.overflowY = 'initial'
}

const handleMenuToggle = (id) => {

    e = window.event;
    e.stopPropagation();

    // Hiding all the status menus from frontend to show only lastest open status menu by the user!
    hideStatusMenus()

    //  showing only that menu to which user wnats to select status!
    let statusMenu = document.querySelector(`#menu${id}`);
    statusMenu.classList.remove('hide')

    if (e.clientY < 380 && todos.length > 3) {
        statusMenu.classList.add('topplus2')
    }
    else statusMenu.classList.remove('topplus2')

}

function handleStatusChange(elm, id) {
    e = window.event;

    if (e.stopPropagation) {
        console.log("iusfo");
        e.stopPropagation();
    }

    let menuById = document.querySelector(`#menu${id}`)

    let menuChilds = menuById.children

    Array.from(menuChilds).forEach(statusName => statusName.classList.remove('activeStatus'))
    elm.classList.add('activeStatus')

    let statusBtn = document.querySelector(`#statusBtn${id}`)
    statusBtn.innerHTML = e.target.innerText + `<i class="fa-solid fa-caret-down"></i>`

    hideStatusMenus()

    todos = todos.map(todo => {
        if (todo.id === id) {
            todo.status = elm.innerText
        }
        return todo
    })
    // console.log(todos)
    renderTodos(todos)
}

window.addEventListener('click', () => hideStatusMenus())

function renderTodos(todos) {
    localStorage.setItem('todos', JSON.stringify(todos))
    todoHeading.innerText = todos.length < 1 ? 'Add your first Todo*' : "My-ToDo's"
    todosBox.innerHTML = ""
    todos.forEach(todo => {
        let todoHTML = `<div class="totoBox">
                            <div class="statusBox">
                                <div id=menu${todo.id} class="statusMenu hide">
                                    <span onclick="handleStatusChange(this,${todo.id})" class="statusName scheduleStatus ${todo.status === 'Schedule' && 'activeStatus'}">Schedule</span>
                                    <span onclick="handleStatusChange(this,${todo.id})" class="statusName progressStatus ${todo.status === 'In progress' && 'activeStatus'}">In progress</span>
                                    <span onclick="handleStatusChange(this,${todo.id})" class="statusName holdStatus ${todo.status === 'On hold' && 'activeStatus'}">On hold</span>
                                    <span onclick="handleStatusChange(this,${todo.id})" class="statusName completedStatus ${todo.status === 'Completed' && 'activeStatus'}">Completed</span>
                                </div>
                                <p id=statusBtn${todo.id} class="status ${colorValuesBystatus[todo.status]}" onclick="handleMenuToggle(${todo.id})">${todo.status}<i class="fa-solid fa-caret-down"></i></p>
                            </div>
                            <div class="todoData">
                                <div class="todo_content">
                                    <p class=${todo.status === 'Completed' && 'overLine'}>${todo.title}</p>
                                </div>
                                <div class="todo_action">
                                    <button class="editBtn" ${todo.status === 'Completed' ? 'disabled' : ""} onclick="handleTodoActions('edit',${todo.id})">Edit</button>
                                    <button class="delBtn"  onclick="handleTodoActions('del',${todo.id})">Delete</button>
                                </div>
                            </div>
                        </div>`
        todosBox.innerHTML += todoHTML
    })
    // console.log(todos);
}

todoInput.addEventListener('input', (e) => {
    if (e.target.value.length > 0) {
        operationBtn.classList.add('active')
    }
    else operationBtn.classList.remove('active')
})

operationBtn.addEventListener('click', (e) => {
    e.preventDefault()

    // Validation code starts here......................
    if (todoInput.value === "") {
        errorTxt.classList.remove('hide')
        todoInput.focus()
        todoInput.classList.add('errorInpt')
        return
    }
    todoInput.classList.remove('errorInpt')
    errorTxt.classList.add('hide')
    // Validation code ends here......................

    if (e.target.innerText === 'Add') {
        let todo = {}
        todo.status = "Schedule"
        todo.title = todoInput.value;
        todo.id = todos.length + 1
        todos.unshift(todo);
        hideShowTodoScroll()
    }
    else if (e.target.innerText === 'Save') {
        todos = todos.filter(todo => todo.title = todo.id === editId ? todoInput.value : todo.title)
        operationBtn.innerText = 'Add'
        operationBtn.classList.remove('active')
    }

    renderTodos(todos)
    todoInput.value = ""
    operationBtn.classList.remove('active')
})

const handleTodoActions = (type, id) => {
    if (type === 'del') {
        todos = todos.filter(todo => {
            if (todo.id !== id) return todo
        })
        renderTodos(todos)
        hideShowTodoScroll()
    }
    else if (type === "edit") {
        operationBtn.classList.add('active')
        operationBtn.innerText = 'Save'
        let todoToEdit = todos.filter(todo => todo.id === id)[0]
        todoInput.value = todoToEdit.title
        editId = todoToEdit.id
    }
}






