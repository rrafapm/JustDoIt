
const taskList = document.getElementById('taskList');
const btnFilter = document.getElementById('btnFilter');
const tasksFilter = document.getElementById('tasksFilter');


// const btnDelAllTasks = document.getElementById('btnDelAllTasks');


////////////////////////////////////////////////////////////////
//////////////////////   Data for testing  /////////////////////
////////////////////////////////////////////////////////////////
// Task object
// {
//     name: string,
//     duedate: date object,
//     priority: int
// };
// Create data for testing
function initShowTasks() {

const testTask = {
    name: "Wash the car",
    duedate: new Date(2024, 4, 19),
    priority: "2"
}
console.log(testTask);
// LLamada a la función que escribe los datos en el LocalStorage
addTaskToLS(testTask);
// LLamada a la función que escribe los datos en el DOM
addTaskToDOM(testTask);

const testTask2 = {
    name: "Walk the dog",
    duedate: new Date(2024, 4, 12),
    priority: "0"
}
console.log(testTask2);
// LLamada a la función que escribe los datos en el LocalStorage
addTaskToLS(testTask2);
// LLamada a la función que escribe los datos en el DOM
addTaskToDOM(testTask2);

const testTask3 = {
    name: "Feed the snake",
    duedate: new Date(2024, 4, 5),
    priority: "1"
}
console.log(testTask3);
// LLamada a la función que escribe los datos en el LocalStorage
addTaskToLS(testTask3);
// LLamada a la función que escribe los datos en el DOM
addTaskToDOM(testTask3);
}

// First function to run in a load or reload (FOR DEBUG PURPOSES ONLY!)
function runMeFirst() {

    const tasksFromLS = JSON.parse(localStorage.getItem('tasks'));
    console.log(tasksFromLS);
    if (tasksFromLS === null) initShowTasks();
    tasksFromLS.forEach((i) => addTaskToDOM(i));

}

////////////////////////////////////////////////////////////////
/////////////////// Data for testing end ///////////////////////
////////////////////////////////////////////////////////////////



// This function opens the modals
function openDlg(dialog) {
    console.log("open dialog: " + dialog);
    const currentDlg = document.getElementById(dialog);
    currentDlg.showModal();
}

// This function closes the modals
function closeDlg(dialog) {
    
    // Set to 0 the form input values
    if(dialog === 'addTaskDlg') {
        const formAddTask = document.getElementById('formAddTask');
        formAddTask.reset();
    }

    const currentDlg = document.getElementById(dialog);
    currentDlg.close();

}

// This is the function that is called by the button add task in the modal
function addTask(dialog) {
    
    // Point to the form inputs
    const InptTaskName = document.getElementById('taskName');
    const InptTaskDate = document.getElementById('taskDueDate');
    const InptTaskPriority = document.getElementById('taskPriority');
    
    // Build the object
    const taskObj = {
        name: InptTaskName.value,
        duedate: new Date(InptTaskDate.value),
        priority: InptTaskPriority.value
    }

    // Call the function that writes data into LocalStorage
    addTaskToLS(taskObj);

    // Call the function that writes data into DOM
    addTaskToDOM(taskObj);

    closeDlg(dialog);

}

// Add the data to localStorage
function addTaskToLS(taskObj) {

    // Get data from LS
    let tasksFromLS = JSON.parse(localStorage.getItem('tasks'));
    if (tasksFromLS === null) tasksFromLS = new Array;

    // Add new object
    tasksFromLS.push(taskObj);

    // Send new data to LS
    localStorage.setItem('tasks', JSON.stringify(tasksFromLS));

}

// Add the task to DOM
function addTaskToDOM(taskObj) {

    // Call the function that builds the article
    const article = buildArticle(taskObj);

    // Append the "article" to the section 
    taskList.appendChild(article);

    // Only for debug
    const tasksFromLS = JSON.parse(localStorage.getItem('tasks'));
    console.log(tasksFromLS);

}

// Build article
function buildArticle(taskObj){

    let priority = taskObj.priority;
    let priorityString;
    switch(parseInt(taskObj.priority)) {
        case 0:
            priorityString = "High";
            break;
        case 1:
            priorityString = "Medium";
            break;
        case 2:
            priorityString = "Low";
            break;
    }

    const article = document.createElement('article');
    const expDate = new Date(taskObj.duedate);
    article.className = 'task';
    article.innerHTML = `<span class="taskName">${taskObj.name}</span>`
                      + `<span class="expDate">Due date: ${expDate.toLocaleDateString()}</span>`
                      + `<span class="priority">Priority: ${priorityString}</span>`
                      + `<button onclick="deleteTask('${taskObj.name}')">`
                      + `<span class="ko material-symbols-outlined">delete_forever</span>Delete task`
                      + `</button>`;

    return article;

}

// Delete one task
function deleteTask(task) {

    // Get data from DOM
    const tasksFromDOM = taskList.querySelectorAll('article');
    // Get data from LS
    const tasksFromLS = JSON.parse(localStorage.getItem('tasks'));
    // Index for LS array
    let index = 0;

    // Iterate data from DOM
    tasksFromDOM.forEach((i) => {

        if(i.firstElementChild.textContent === task) {
            
            // Delete task from DOM
            taskList.removeChild(i);
            // Delete task from LS
            tasksFromLS.splice(index, 1);

        }
        // Increase index
        index++;
    }  
    );

    // Write the updated 'tasks' in LS
    localStorage.setItem('tasks', JSON.stringify(tasksFromLS));

}

// Delete All Tasks From DOM !!!
function deleteAllTasksFromDOM(){
    
    // Leave the <section> empty
    taskList.innerHTML = "";

}

// Delete All Tasks From LS !!!
function deleteAllTasksFromLS() {
    localStorage.removeItem('tasks');
}

// Delete All Tasks !!!
function deleteAllTasks() {

    // Delete All Tasks From DOM
    deleteAllTasksFromDOM();
    // Delete All Tasks From LS
    deleteAllTasksFromLS();
    // Close modal
    closeDlg('removeAllTasksDlg')

}

// Function to filter tasks
function filterTasks(e) {

    // Change the logo and the text in the filter button
    btnFilter.firstElementChild.textContent = 'filter_alt_off';
    btnFilter.lastChild.textContent = 'Clear filter';

    // Get the list of 'tasks'
    const taskFromDOM = taskList.querySelectorAll('article');
    // Convert the input text to lower case for comparison
    const text = e.target.value.toLocaleLowerCase();

    // Hide tasks using display property
    taskFromDOM.forEach((i) => {
        // Get the task name and convert it to lower case for comparison
        const itemName = i.firstElementChild.textContent.toLocaleLowerCase();
        if(itemName.indexOf(text)!=-1){
            i.style.display = 'flex';
        }else{
            i.style.display = 'none';
        }
    }
    );

    // Change the logo and the text in the filter button
    if(tasksFilter.value === '') {
        btnFilter.firstElementChild.textContent = 'filter_alt';
        btnFilter.lastChild.textContent = 'Filter tasks';
    }

}

// Clear the filter input and display all the tasks
function clearFilter() {

    tasksFilter.value = '';
    const task = taskList.querySelectorAll('article');
    task.forEach((i) => i.style.display = 'flex');

}

// Changes the aspect of the filter button when is clicked
function focusToFilter() {

    if(btnFilter.firstElementChild.textContent === 'filter_alt_off') {
        btnFilter.firstElementChild.textContent = 'filter_alt';
        btnFilter.lastChild.textContent = 'Filter tasks';
        clearFilter();
    } else {
        tasksFilter.focus();
        btnFilter.firstElementChild.textContent = 'filter_alt_off';
        btnFilter.lastChild.textContent = 'Clear filter';
    }
}

// Sort tasks by date
function sortByDate() {
    
    // Get data from LS
    const tasksFromLS = JSON.parse(localStorage.getItem('tasks'));
    // Order the data with the sort function
    tasksFromLS.sort((a,b) => {return a.duedate.localeCompare(b.duedate)});

    // Write the "ordered" tasks in LS
    localStorage.setItem('tasks', JSON.stringify(tasksFromLS));

    // Delete All Tasks From DOM
    deleteAllTasksFromDOM();
    
    // Add All Tasks to DOM
    tasksFromLS.forEach((i) => addTaskToDOM(i));

    closeDlg('sortTasksDlg')
   
}

// Sort tasks by priority
function sortByPriority() {
    
    // Get data from LS
    const tasksFromLS = JSON.parse(localStorage.getItem('tasks'));
    // Order the data with the sort function
    tasksFromLS.sort((a,b) => {return a.priority - b.priority});

    // Write the "ordered" tasks in LS
    localStorage.setItem('tasks', JSON.stringify(tasksFromLS));

    // Delete All Tasks From DOM
    deleteAllTasksFromDOM();
    
    // Add All Tasks to DOM
    tasksFromLS.forEach((i) => addTaskToDOM(i));

    closeDlg('sortTasksDlg')
   
}


// Event listeners for the filter button and input
btnFilter.addEventListener('click', focusToFilter);
tasksFilter.addEventListener('input', filterTasks);


// First function to run in a load or reload (FOR DEBUG PURPOSES ONLY!)
document.addEventListener('DOMContentLoaded', runMeFirst);
