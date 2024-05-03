
const taskList = document.getElementById('taskList');
const btnFilter = document.getElementById('btnFilter');
const tasksFilter = document.getElementById('tasksFilter');
const taskDlg = document.getElementById('addTaskDlg');

let oldTask;


// const btnDelAllTasks = document.getElementById('btnDelAllTasks');


////////////////////////////////////////////////////////////////
//////////////////////   Data for testing  /////////////////////
////////////////////////////////////////////////////////////////
// task object =
// {
//     name: string,
//     duedate: date object,
//     priority: int
// };

// Use for debug only!!!
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

////////////////////////////////////////////////////////////////
/////////////////// Data for testing end ///////////////////////
////////////////////////////////////////////////////////////////

// First function to run in a load or reload (FOR DEBUG PURPOSES ONLY!)
function runMeFirst() {

    // Check for previous data
    let tasksFromLS = JSON.parse(localStorage.getItem('tasks'));
    if (tasksFromLS === null){
        tasksFromLS = new Array;
    } else {
        tasksFromLS.forEach((i) => addTaskToDOM(i));
    }
    localStorage.setItem('tasks', JSON.stringify(tasksFromLS));
    
    // Use for debug only!!!
    // const tasksFromLS = JSON.parse(localStorage.getItem('tasks'));
    // console.log(tasksFromLS);
    // if (tasksFromLS === null) initShowTasks();
    // tasksFromLS.forEach((i) => addTaskToDOM(i));

}

// This function opens the modals
function openDlg(dialog) {
    // console.log("open dialog: " + dialog);
    const currentDlg = document.getElementById(dialog);
    currentDlg.showModal();
}

// This function closes the modals
function closeDlg(...dialog) {
    
    // Set to 0 the form input values
    if(dialog[0] === 'addTaskDlg') {
        const formAddTask = document.getElementById('formAddTask');
        formAddTask.reset();
    }

    // Check if the function is call with the name of a task
    if(dialog[1]) {

        // Build an object using the parameters passed by the function
        let buffer = dialog[1].split(',');
        const obj = {
            name: buffer[0],
            duedate: buffer[1],
            priority: buffer[2]
        }
        // console.log(obj);
        // console.log(typeof obj);

        // Insert back to the LS the task passed as a parameter
        addTaskToLS(obj);
        // "Write" back the task in the DOM
        addTaskToDOM(obj);
        oldTask = '';
        
        const addTaskDlgCancel = document.getElementById('addTaskDlgCancel');
        addTaskDlgCancel.setAttribute('onclick',"closeDlg('addTaskDlg')");

        const formAddTask = document.getElementById('formAddTask');
        formAddTask.reset();

    }

    // Reset the h2 in add/edit dialog
    if(taskDlg.firstElementChild.textContent === 'Edit the task') {
        taskDlg.firstElementChild.textContent = 'Fill the form to add a new task';
    }

    const currentDlg = document.getElementById(dialog[0]);
    currentDlg.close();

}

// This is the function that is called by the button "add task" in the modal
function addTask(dialog) {
    
    // Point to the form inputs
    const InptTaskName = document.getElementById('taskName');
    const InptTaskDate = document.getElementById('taskDueDate');
    const InptTaskPriority = document.getElementById('taskPriority');

    // Safe to not insert empty tasks
    let exit = false;

    // Point to warning message in case is needed
    const InptWarningMsg = document.getElementById('inputWarningMsg');

    // Check if inputs are valid
    // All filds must be filled
    if ((InptTaskName.value === '') || (InptTaskDate.value === '')){
        InptWarningMsg.textContent = "You must fill all fields.";
        exit = true;
        closeDlg(dialog);
        openDlg('inputWarningDlg');
        return
    }
    // Check for date in the past
    // Get current date an the date introduced in the input
    const inputTime = new Date(InptTaskDate.value);
    const currentTime = new Date;
    // To allow current day
    currentTime.setDate(currentTime.getDate() - 1);
    // Checking the date is in the past
    if((inputTime.getTime() - currentTime.getTime()) < 0 ) {
        InptWarningMsg.textContent = "The date you introduced is not correct.";
        closeDlg(dialog);
        openDlg('inputWarningDlg');
        return
    }
    // Check for a task with the same name
    // Get the data in LS
    const tasksFromLS = JSON.parse(localStorage.getItem('tasks'));

    tasksFromLS.forEach((i) => {
        if(i.name.toLocaleLowerCase() === InptTaskName.value.toLocaleLowerCase()) {
            InptWarningMsg.textContent = "Already exist a task with the same name.";
            closeDlg(dialog);
            openDlg('inputWarningDlg');
            return
        }
    })

    if(exit) return;
    
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
    // const tasksFromLS = JSON.parse(localStorage.getItem('tasks'));
    // console.log(tasksFromLS);

    // Reset the form
    const formAddTask = document.getElementById('formAddTask');
    formAddTask.reset();

}

// Build article
function buildArticle(taskObj){

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
    // article.className = 'task';
    article.innerHTML = `<div class="task">`
                      + `<span class="taskName">${taskObj.name}</span>`                      
                      + `<div class="taskData">`
                      + `<span class="expDate"><span class="material-symbols-outlined">calendar_today</span> ${expDate.toLocaleDateString('en-GB')}</span>`
                      + `<span class="priority"><span class="material-symbols-outlined">priority_high</span> ${priorityString}</span>`
                      + `</div>`
                      + `</div>`
                      + `<div class="taskActions">`
                      + `<button onclick="editTask('${taskObj.name}')">`
                      + `<span class="material-symbols-outlined">edit</span>`
                      + `</button>`
                      + `<button onclick="deleteTask('${taskObj.name}')">`
                      + `<span class="material-symbols-outlined">delete_forever</span>`
                      + `</button>`
                      + `</div>`;

    return article;

}

// Edit task
function editTask(task) {

    // "Pointers" to inputs fields in form
    const taskName = document.getElementById('taskName');
    const taskDueDate = document.getElementById('taskDueDate');
    const taskPriority = document.getElementById('taskPriority');

    // Get tasks from LS
    const tasksFromLS = JSON.parse(localStorage.getItem('tasks'));
    let index = 0;

    tasksFromLS.forEach((i) => {

        if(i.name === task) {

            const addTaskDlgCancel = document.getElementById('addTaskDlgCancel');
            
            // Parse the data stored in LS
            let buffer = new Date(tasksFromLS[index].duedate);
            let bufferDate = buffer.toLocaleDateString('en-GB').split('/');
            let bufferDay = bufferDate[0];
            let bufferMonth = bufferDate[1];
            let bufferYear = bufferDate[2];
            bufferDate = bufferYear + '-' + bufferMonth + '-' + bufferDay;

            // Insert data from task in the values of the form
            taskName.value = tasksFromLS[index].name;
            taskDueDate.value = bufferDate;
            taskPriority.value = tasksFromLS[index].priority;
            
            // Add old Task as parameter of closeDLg() function to handle user's click in cancel button
            oldTask = [tasksFromLS[index].name, tasksFromLS[index].duedate, tasksFromLS[index].priority];
            let dialogName = 'addTaskDlg';
            addTaskDlgCancel.setAttribute('onclick',`closeDlg('${dialogName}', '${oldTask}')`);

            // Change the h2 in add/edit dialog
            taskDlg.firstElementChild.textContent = 'Edit the task';

            // Delete old task from LS
            deleteTask(tasksFromLS[index].name);
                       
            openDlg('addTaskDlg');

        } // else {
        //     console.log('no');
        // };

        index++;
    })

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

        if(i.firstChild.firstElementChild.textContent === task) {
            
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
    let tasksFromLS = new Array;
    localStorage.setItem('tasks', JSON.stringify(tasksFromLS));
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
        const itemName = i.firstElementChild.firstElementChild.textContent.toLocaleLowerCase();
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


// First function to run in a load or reload (MOSTLY FOR DEBUG PURPOSES!)
document.addEventListener('DOMContentLoaded', runMeFirst);
