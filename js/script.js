// Task object
// {
//     name: string,
//     duedate: date object,
//     priority: integer
// };

const testDate = new Date;
console.log(testDate);
const testDate2 = new Date;
console.log(testDate2);
const testDate3 = new Date;
console.log(testDate3);
let tasks = new Array;


const testTask = {
    name: "Wash the car",
    duedate: testDate,
    priority: 2
}
console.log(testTask);
tasks.push(testTask);
localStorage.setItem('tasks', JSON.stringify(tasks));

const testTask2 = {
    name: "Walk the dog",
    duedate: testDate2,
    priority: 0
}
console.log(testTask2);
tasks.push(testTask2);
localStorage.setItem('tasks', JSON.stringify(tasks));

const testTask3 = {
    name: "Feed the snake",
    duedate: testDate3,
    priority: 1
}
console.log(testTask3);
tasks.push(testTask3);
localStorage.setItem('tasks', JSON.stringify(tasks));