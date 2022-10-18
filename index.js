const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'brandomaggo',
        database: 'employee_tracker'
    },
    console.log(`Connected to the employee_tracker DB`)
);




const questionOne = function questionOne() {
    const prompt = inquirer.createPromptModule()
    prompt([
        {
            type: "list",
            name: "options",
            message: "Please choose an option from the list below",
            choices: ["View all departments", "View all roles", "View all employees", "Add a department",
        "Add an employee", "Update an employee role"]
        }
    ])
    .then((data) => {
        switch(data.options) {
            case "View all employees":
                viewAll();
                break;
        }
    })
} 

async function viewAll() {
db.query('SELECT * FROM employee', function (err, results) {
    console.table(results);
    questionOne()
})
}

questionOne();