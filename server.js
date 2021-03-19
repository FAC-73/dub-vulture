'use strict';

// dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');
require('console.table');

// object array for questions
const promptMessages = {
    showAllEmployees: "Show All Employee's",
    showByDepartment: "Show All Employee's By Department",
    showByManager: "Show All Employee's By Manager",
    addEmployee: "Add a New Employee",
    removeEmployee: "Remove Employee",
    updateRole: "Update an Employee's Role",
    updateEmployeeManager: "Update Employee's Manager",
    showAllRoles: "Show All Roles",
    exit: "Exit"
};

// set up connection & add in PORT
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,

    // Username & password
    user: 'root',
    password: 'password--1',

    // database name
    database: 'employees'
});

// if an error throw an error, else start prompt
connection.connect(err => {
    if (err) throw err;
    prompt();
});

// run prompt function using inquirer, choices array displayed as list
function prompt() {
    inquirer
        .prompt({
            name: 'action',
            type: 'list',
            message: 'Manage employee database, select an option',
            choices: [
                promptMessages.showAllEmployees,
                promptMessages.showByDepartment,
                promptMessages.showByManager,
                promptMessages.showAllRoles,
                promptMessages.addEmployee,
                promptMessages.removeEmployee,
                promptMessages.updateRole,
                promptMessages.exit
            ]
        })

        // Switch statement runs function based on selection
        .then(answer => {
            console.log('answer', answer);
            switch (answer.action) {

                // Runs show all employees function
                case promptMessages.showAllEmployees:
                    showAllEmployees();
                    break;

                // Runs show all employees by department function
                case promptMessages.showByDepartment:
                    showByDepartment();
                    break;

                // Runs show all employees by manager function
                case promptMessages.showByManager:
                    showByManager();
                    break;

                // Runs add employee function
                case promptMessages.addEmployee:
                    addEmployee();
                    break;

                // Runs remove employee function
                case promptMessages.removeEmployee:
                    remove('delete');
                    break;

                // Runs update role function
                case promptMessages.updateRole:
                    remove('role');
                    break;

                // Runs show all roles function
                case promptMessages.showAllRoles:
                    showAllRoles();
                    break;

                // Exits application
                case promptMessages.exit:
                    connection.end();
                    break;
            }
        });
}

// run mySql schema for displaying all employees with employee first name as first column, joining employees, department and roles table, ordering by employee id
function showAllEmployees() {
    const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id
    INNER JOIN role ON (role.id = employee.role_id)
    INNER JOIN department ON (department.id = role.department_id)
    ORDER BY employee.id;`;

    // connect to database, if error throw error. Else console.log show all employees message and table. run prompt
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('Show all employees');
        console.log('\n');
        console.table(res);
        prompt();
    });
}

// run mySql schema for displaying all employees by department as first column, joining employees, department and roles table, ordering by department name
function showByDepartment() {
    const query = `SELECT department.name AS department, role.title, employee.id, employee.first_name, employee.last_name
    FROM employee
    LEFT JOIN role ON (role.id = employee.role_id)
    LEFT JOIN department ON (department.id = role.department_id)
    ORDER BY department.name;`;

    // mysql query function if error throw error. Else console.log show all employees by department message and table. run prompt
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('Show employees by department');
        console.log('\n');
        console.table(res);
        prompt();
    });
}

// run mySql schema for displaying all employees by manager as first column, joining employees, department and roles table, ordering by manager name
function showByManager() {
    const query = `SELECT CONCAT(manager.first_name, ' ', manager.last_name) AS manager, department.name AS department, employee.id, employee.first_name, employee.last_name, role.title
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id
    INNER JOIN role ON (role.id = employee.role_id && employee.manager_id != 'NULL')
    INNER JOIN department ON (department.id = role.department_id)
    ORDER BY manager;`;

    // mysql query function if error throw error. Else console.log show all employees with managers message and table. run prompt
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('Show employees with managers');
        console.log('\n');
        console.table(res);
        prompt();
    });
}

// run mySql schema for displaying all roles as first column, joining employees, department and roles table, ordering by role title
function showAllRoles() {
    const query = `SELECT role.title, employee.id, employee.first_name, employee.last_name, department.name AS department
    FROM employee
    LEFT JOIN role ON (role.id = employee.role_id)
    LEFT JOIN department ON (department.id = role.department_id)
    ORDER BY role.title;`;

    // mysql query function if error throw error. Else console.log show all employees with managers message and table. run prompt
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('Show employees by role');
        console.log('\n');
        console.table(res);
        prompt();
    });

}

// run function addEmployee
async function addEmployee() {
    
    // async promise awaits inquirer prompt array stored in askName function 
    const addname = await inquirer.prompt(askName());

    // async promise awaits values from roles.id and roles.title from database maps as choice list
    connection.query('SELECT role.id, role.title FROM role ORDER BY role.id;', async (err, res) => {
        if (err) throw err;
        const { role } = await inquirer.prompt([
            {
                name: 'role',
                type: 'list',
                choices: () => res.map(res => res.title),
                message: 'What is the employees role?: '
            }
        ]);
        let roleId;
        for (const row of res) {
            if (row.title === role) {
                roleId = row.id;
                continue;
            }
        }
        connection.query('SELECT * FROM employee', async (err, res) => {
            if (err) throw err;
            let choices = res.map(res => `${res.first_name} ${res.last_name}`);
            choices.push('none');
            let { manager } = await inquirer.prompt([
                {
                    name: 'manager',
                    type: 'list',
                    choices: choices,
                    message: 'Select employees Manager: '
                }
            ]);
            let managerId;
            let managerName;
            if (manager === 'none') {
                managerId = null;
            } else {
                for (const data of res) {
                    data.fullName = `${data.first_name} ${data.last_name}`;
                    if (data.fullName === manager) {
                        managerId = data.id;
                        managerName = data.fullName;
                        console.log(managerId);
                        console.log(managerName);
                        continue;
                    }
                }
            }
            console.log('Employee has been added to the database. Show all employees to see the updated list');
            connection.query(
                'INSERT INTO employee SET ?',
                {
                    first_name: addname.first,
                    last_name: addname.last,
                    role_id: roleId,
                    manager_id: parseInt(managerId)
                },
                (err, res) => {
                    if (err) throw err;
                    prompt();
                }
            );
        });
    });

}
function remove(input) {
    const promptQ = {
        yes: "yes",
        no: "no, return to show all employees"
    };
    inquirer.prompt([
        {
            name: "action",
            type: "list",
            message: "In order to proceed an employee ID must be entered. Show all employees to get" +
                " the employee ID. Do you know the employee ID?",
            choices: [promptQ.yes, promptQ.no]
        }
    ]).then(answer => {
        if (input === 'delete' && answer.action === "yes") removeEmployee();
        else if (input === 'role' && answer.action === "yes") updateRole();
        else showAllEmployees();
    });
};

async function removeEmployee() {

    const answer = await inquirer.prompt([
        {
            name: "first",
            type: "input",
            message: "Enter the ID for the employee you want to remove:  "
        }
    ]);

    connection.query('DELETE FROM employee WHERE ?',
        {
            id: answer.first
        },
        function (err) {
            if (err) throw err;
        }
    )
    console.log('Employee has been successfully removed from the database');
    prompt();

};
function askId() {
    return ([
        {
            name: "name",
            type: "input",
            message: "What is the employee ID?:  "
        }
    ]);
}


async function updateRole() {
    const employeeId = await inquirer.prompt(askId());

    connection.query('SELECT role.id, role.title FROM role ORDER BY role.id;', async (err, res) => {
        if (err) throw err;
        const { role } = await inquirer.prompt([
            {
                name: 'role',
                type: 'list',
                choices: () => res.map(res => res.title),
                message: 'What is the employees role?: '
            }
        ]);
        let roleId;
        for (const row of res) {
            if (row.title === role) {
                roleId = row.id;
                continue;
            }
        }
        connection.query(`UPDATE employee 
        SET role_id = ${roleId}
        WHERE employee.id = ${employeeId.name}`, async (err, res) => {
            if (err) throw err;
            console.log('Role has been updated')
            prompt();
        });
    });
}

function askName() {
    return ([
        {
            name: "first",
            type: "input",
            message: "Enter the first name of the employee: "
        },
        {
            name: "last",
            type: "input",
            message: "Enter a last name for the employee: "
        }
    ]);
}