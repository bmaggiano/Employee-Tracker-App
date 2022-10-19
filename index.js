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
        "Add a role", "Add an employee", "Update an employee role"]
        }
    ])
    .then((data) => {
        switch(data.options) {
            case "View all employees":
                viewEmployees();
                break;
            case "View all departments":
                viewDepartments();
                break;
            case "View all roles":
                viewRoles();
                break;
            case "Add an employee":
                addEmployee();
                break;
            case "Add a role":
                addRole();
                break;
            case "Add a department":
                addDepartment();
                break;
        }
    })
} 

async function viewEmployees() {
db.query('SELECT * FROM employee', function (err, results) {
    console.table(results);
    questionOne()
})
}

async function viewDepartments() {
    db.query('SELECT * FROM department', function (err, results) {
        console.table(results);
        questionOne()
    })
}
async function viewRoles() {
    db.query('SELECT * FROM roles', function (err, results) {
        console.table(results);
        questionOne()
    })
}

const departmentArr = []
const selectDepartment = function selectDepartment() {
    db.query('SELECT department_name FROM department', function (err, results) {
        for (let i=0; i<results.length; i++) {
            departmentArr.push(results[i].department_name);
        }
    })
    return departmentArr;
}

const rolesArr = []
const selectRole = function selectRole() {
    db.query('SELECT title FROM roles', function (err, results) {
        for (let i=0; i<results.length; i++) {
            rolesArr.push(results[i].title);
        }
    })
    return rolesArr;
}

const managerArr = []
const selectManager = function selectManager() {
    db.query('SELECT first_name, last_name FROM employee', function (err, results) {
        for (let i=0; i<results.length; i++) {
            managerArr.push(`${results[i].first_name} ${results[i].last_name}`);
        }
    })
    return managerArr;
}



async function addEmployee() {
    const prompt = inquirer.createPromptModule()
    prompt([
        {
            name: "employeeFName",
            message: "What is the employee's first name?",
        },
        {
            name: "employeeLName",
            message: "What is the employee's last name?",
        },
        {
            type: "list",
            name: "employeeRole",
            message: "What is the employee's role?",
            choices: selectRole(),
        },
        {
            type: "list",
            name: "employeeManager",
            message: "Does this employee have a manager?",
            choices: selectManager()
        }
    ])
    .then((data) => {
        const roleId = selectRole().indexOf(data.employeeRole) + 1
        const managerId = selectManager().indexOf(data.employeeManager) + 1
        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
        VALUES ("${data.employeeFName}", "${data.employeeLName}", ${roleId}, ${managerId})`)
        console.log("Employee Added Successfully")
        questionOne()
    })
}

async function addRole() {
    const prompt = inquirer.createPromptModule()
    prompt([
        {
            name: "roleTitle",
            message: "What is the title of the role?",
        },
        {
            type: "number",
            name: "roleSalary",
            message: "What is salary of this role?",
        },
        {
            type: "list",
            name: "roleDepartment",
            message: "What department does this role belong to?",
            choices: selectDepartment(),
        }
    ])
    .then((data) => {
        const departmentId = selectDepartment().indexOf(data.roleDepartment) + 1
        db.query(`INSERT INTO roles (title, salary, department_id)
        VALUES ("${data.roleTitle}", "${data.roleSalary}", ${departmentId})`)
        console.log("Role Added Successfully");
        questionOne()
    })
};





questionOne();