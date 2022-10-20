// Dependencies and installs
const inquirer = require('inquirer');
const mysql = require('mysql2');

// Creating connection to mysql db
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'brandomaggo',
        database: 'employee_tracker'
    },
    console.log(`Connected to the employee_tracker DB`)
);

// First question using inquirer, will present user a list of questions and then with a swtich statement
// we will respond accordingly
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
            case "Update an employee role":
                updateEmployee();
                break;
        }
    })
} 

// Function to view all employees
async function viewEmployees() {
db.query(`SELECT first_name, last_name, title, salary, department_name FROM employee JOIN roles ON roles.id = employee.role_id JOIN department ON department.id = roles.department_id`, function (err, results) {
    console.table(results);
    questionOne()
})
}

// Function to view all departments
async function viewDepartments() {
    db.query('SELECT * FROM department', function (err, results) {
        console.table(results);
        questionOne()
    })
}

// Function to view all roles
async function viewRoles() {
    db.query('SELECT title, salary, department_name FROM roles JOIN department ON department.id = roles.department_id', function (err, results) {
        console.table(results);
        questionOne()
    })
}

// Function to pull department data from sql and convert into array for inquirer choices
const departmentArr = []
const selectDepartment = function selectDepartment() {
    db.query('SELECT department_name FROM department', function (err, results) {
        for (let i=0; i<results.length; i++) {
            departmentArr.push(results[i].department_name);
        }
    })
    return departmentArr;
}

// Function to pull roles data from sql and convert into array for inquirer choices
const rolesArr = []
const selectRole = function selectRole() {
    db.query('SELECT title FROM roles', function (err, results) {
        for (let i=0; i<results.length; i++) {
            rolesArr.push(results[i].title);
        }
    })
    return rolesArr;
}

// Function to pull manager data from sql and convert into array for inquirer choices
const managerArr = []
const selectManager = function selectManager() {
    db.query('SELECT first_name, last_name FROM employee', function (err, results) {
        for (let i=0; i<results.length; i++) {
            managerArr.push(`${results[i].first_name} ${results[i].last_name}`);
        }
    })
    return managerArr;
}

// Function to pull employee data from sql and convert into array for inquirer choices
const employeeArr = []
const selectEmployee = function selectEmployee() {
    db.query('SELECT first_name, last_name FROM employee', function (err, results) {
        for (let i=0; i<results.length; i++) {
            employeeArr.push(`${results[i].first_name} ${results[i].last_name}`);
        }
    })
    return employeeArr;
}

// Function to update employee data based on inquirer input
async function updateEmployee() {
    const prompt = inquirer.createPromptModule()
    prompt([
        {
            type: 'confirm',
            name: 'yousure',
            message: "Are you sure you would like to update an employee's role?"
        },
        {
            type: "list",
            name: "employee",
            message: "Please select an employee.",
            choices: selectEmployee()
        },
        {
            type: "list",
            name: "newRole",
            message: "Please select a new role for this employee.",
            choices: selectRole()
        },

    ])
    .then((data) => {
        const newRoleId = selectRole().indexOf(data.newRole) + 1
        const employee = selectEmployee().indexOf(data.employee) + 1
        db.query(`UPDATE employee SET role_id = ${newRoleId} WHERE id = ${employee}`)
        console.log(`Updated ${data.employee}'s role!`)
        questionOne()
    })
}

// Function to add an employee based off of inquirer input
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

// Function to add a new role based on inquirer input
const addRole = function addRole() {
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

// Function to add a new department based on inquirer input
const addDepartment = function addDepartment() {
    const prompt = inquirer.createPromptModule()
    prompt([
        {
            name: "departmentName",
            message: "What is the department name?",
        }
    ])
    .then((data) => {
        // const departmentName = selectDepartment().indexOf(data.roleDepartment) + 1
        db.query(`INSERT INTO department (department_name)
        VALUES ("${data.departmentName}")`)
        console.log("Department Added Successfully");
        questionOne()
    })
}

// Call question one to kick off the process
questionOne();