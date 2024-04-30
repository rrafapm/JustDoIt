
////////////////////////////////////////////////////////////////
//////////////////////  Datos para pruebas /////////////////////
////////////////////////////////////////////////////////////////
// Task object
// {
//     name: string,
//     duedate: date object,
//     priority: integer
// };

const testDate = new Date;
// console.log(testDate);
const testDate2 = new Date;
// console.log(testDate2);
const testDate3 = new Date;
// console.log(testDate3);
let tasks = new Array;


const testTask = {
    name: "Wash the car",
    duedate: testDate,
    priority: "Low"
}
console.log(testTask);
tasks.push(testTask);
localStorage.setItem('tasks', JSON.stringify(tasks));

const testTask2 = {
    name: "Walk the dog",
    duedate: testDate2,
    priority: "High"
}
console.log(testTask2);
tasks.push(testTask2);
localStorage.setItem('tasks', JSON.stringify(tasks));

const testTask3 = {
    name: "Feed the snake",
    duedate: testDate3,
    priority: "Medium"
}
console.log(testTask3);
tasks.push(testTask3);
localStorage.setItem('tasks', JSON.stringify(tasks));

// Introducir los datos de prueba en LocalStorage y en el DOM

function initShowTasks() {
    const tasksFromLS = JSON.parse(localStorage.getItem('tasks'));
    console.log(tasksFromLS);
        tasksFromLS.forEach((t) => {
            // console.log(t.name);
            // console.log(t.duedate);
            // console.log(t.priority);
            
            const article = document.createElement('article');
            article.className= 'task';
            // console.log(article);

            const spanTN = document.createElement('span');
            spanTN.className = 'taskName';
            spanTN.appendChild(document.createTextNode(t.name));
            article.appendChild(spanTN);
            // console.log(spanTN);

            const spanTD = document.createElement('span');
            spanTD.className = 'expDate';
            spanTD.appendChild(document.createTextNode(t.duedate));
            article.appendChild(spanTD);
            // console.log(spanTD);

            const spanTP = document.createElement('span');
            spanTP.className = 'priority';
            spanTP.appendChild(document.createTextNode(t.priority));
            article.appendChild(spanTP);
            // console.log(spanTP);

            const deleteBtn = document.createElement('span');
            deleteBtn.classList = 'delete material-symbols-outlined';
            deleteBtn.appendChild(document.createTextNode('delete_forever'));
            article.appendChild(deleteBtn);
            // console.log(deleteBtn);

            // const taskToShow
            //     = '<span class="taskName">' + t.name + '</span>\n'
            //     + '<span class="expDate">' + t.date + '</span>\n'
            //     + '<span class="priority">' + t.priority + '</span>\n'
            //     + '<span class="delete material-symbols-outlined">delete_forever</span>\n';
            // console.log(taskToShow);

            taskList.appendChild(article);
        });
}
////////////////////////////////////////////////////////////////
////////////// Hasta aqui los datos de prueba //////////////////
////////////////////////////////////////////////////////////////

const taskList = document.getElementById('taskList');
const btnAddTask = document.getElementById('btnAddTask');





// Función encargada de abrir los modales
function openDlg(dialog) {
    // console.log(dialog);
    const addTaskDlg = document.getElementById(dialog);
    addTaskDlg.showModal();
}

// Función llamada por el botón añadir tarea (del modal añadir tarea)
function addTask(dialog) {
    
    console.log(dialog);
    const InptTaskName = document.getElementById('taskName');
    const InptTaskDate = document.getElementById('taskDueDate');
    const InptTaskPriority = document.getElementById('taskPriority');
    console.log(InptTaskName);
    const taskName = InptTaskName.value;
    console.log(taskName);
    const taskDate = InptTaskDate.value;
    console.log(taskDate);
    const taskPriority = InptTaskPriority.value;
    console.log(taskPriority);

    addTaskToLS(taskName, taskDate, taskPriority);
    addTaskToDOM(taskName, taskDate, taskPriority)
}

// Añadir la tarea al localStorage
function addTaskToLS(taskName, taskDate, taskPriority) {

    // Construimos el objeto
    const taskObj = {
        name: taskName,
        duedate: taskDate,
        priority: taskPriority
    }

    console.log(taskObj);
    // Obtenemos los datos del LS
    const tasksFromLS = JSON.parse(localStorage.getItem('tasks'));
    console.log(tasksFromLS);
    // Añadimos el nuevo objeto
    tasksFromLS.push(taskObj);
    console.log(tasksFromLS);
    // Poner a 0 los valores del formulario
    const formAddTask = document.getElementById('formAddTask');
    formAddTask.reset();
}

// Añadir la tarea al DOM
function addTaskToDOM(taskName, taskDate, taskPriority) {
    // Creamos el "article"
    const article = document.createElement('article');
    article.className= 'task';
    // Creamos el span "nombre"
    const spanTN = document.createElement('span');
    spanTN.className = 'taskName';
    spanTN.appendChild(document.createTextNode(taskName));
    article.appendChild(spanTN);
    // Creamos el span "fecha"
    const spanTD = document.createElement('span');
    spanTD.className = 'expDate';
    spanTD.appendChild(document.createTextNode(taskDate));
    article.appendChild(spanTD);
    // Creamos el span "prioridad"
    const spanTP = document.createElement('span');
    spanTP.className = 'priority';
    spanTP.appendChild(document.createTextNode(taskPriority));
    article.appendChild(spanTP);
    // Creamos el span "boton borrar"
    const deleteBtn = document.createElement('span');
    deleteBtn.classList = 'delete material-symbols-outlined';
    deleteBtn.appendChild(document.createTextNode('delete_forever'));
    article.appendChild(deleteBtn);

    // Añadimos el "article" al section 
    taskList.appendChild(article);

}

// btnAddTask.addEventListener('click', openDlg('addTaskDlg'));
document.addEventListener('DOMContentLoaded', initShowTasks);
