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
    addDepartment: "Add a New Department",
    addRole: "Add a New Role",
    removeEmployee: "Remove Employee",
    removeRole: "Remove Role",
    removeDepartment: "Remove Department",
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
                promptMessages.addDepartment,
                promptMessages.addRole,
                promptMessages.removeEmployee,
                promptMessages.removeDepartment,
                promptMessages.removeRole,
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

                // Runs show all roles function
                case promptMessages.showAllRoles:
                    showAllRoles();
                    break;

                // Runs add employee function
                case promptMessages.addEmployee:
                    addEmployee();
                    break;

                // Runs add employee function
                case promptMessages.addDepartment:
                    addDepartment();
                    break;

                // Runs add employee function
                case promptMessages.addRole:
                    addRole();
                    break;

                // Runs remove employee function
                case promptMessages.removeEmployee:
                    remove('delete');
                    break;

                // Runs remove employee function
                case promptMessages.removeDepartment:
                    remove('delete');
                    break;

                // Runs remove employee function
                case promptMessages.removeRole:
                    remove('delete');
                    break;

                // Runs update role function
                case promptMessages.updateRole:
                    remove('role');
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

        // async promise awaits values from manager id and manager name from database maps as choice list
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

            // inserts into employee database
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

// run function addDepartment
const addDepartment = () => {
    inquirer
        .prompt([
            {
                name: 'name',
                type: 'input',
                message: "Add a name for the new department",
            }
        ])
        .then((answer) => {
            connection.query(
                'INSERT INTO department SET ?',
                {
                    name: answer.name
                },
                (err) => {
                    if (err) throw err;
                    console.log('Successfully added new department');
                    prompt();
                }
            );
        });
};

// run function addRole
const addRole = () => {
    inquirer
        .prompt([
            {
                name: 'title',
                type: 'input',
                message: "Title of the new role?",
            },
            {
                name: 'salary',
                type: 'input',
                message: "Salary for the new role?",
            },
            {
                name: 'department_id',
                type: 'input',
                message: "id of the department for this role?",
            },

        ])
        .then((answer) => {
            connection.query(
                'INSERT INTO role SET ?',
                {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: answer.department_id
                },
                (err) => {
                    if (err) throw err;
                    console.log('The new role was successfully added.');
                    action();
                }
            );
        });
};


// remove employee
function remove(input) {
    const promptQ = {
        yes: "yes",
        no: "no, return to show all employees"
    };

    // prompt to delete employee based on their known id
    inquirer.prompt([
        {
            name: "action",
            type: "list",
            message: "In order to proceed an employee ID must be entered. Show all employees to get" +
                " the employee ID. Do you know the employee ID?",
            choices: [promptQ.yes, promptQ.no]
        }

        // if yes run remove employee function, else run show all employees function
    ]).then(answer => {
        if (input === 'delete' && answer.action === "yes") removeEmployee();
        else if (input === 'role' && answer.action === "yes") updateRole();
        else showAllEmployees();
    });
};

// async promise awaits input value from prompt
async function removeEmployee() {
    const answer = await inquirer.prompt([
        {
            name: "first",
            type: "input",
            message: "Enter the ID for the employee you want to remove:  "
        }
    ]);

    // deletes employee from employee where id matches response
    connection.query('DELETE FROM employee WHERE ?',
        {
            id: answer.first
        },
        function (err) {
            if (err) throw err;
        }
    )
    // confirms employee was removed
    console.log('Employee has been successfully removed from the database');
    prompt();

};

// runs function to prompt for ID
function askId() {
    return ([
        {
            name: "name",
            type: "input",
            message: "What is the employee ID?:  "
        }
    ]);
}

// async promise awaits input value from askId function prompt array
async function updateRole() {
    const employeeId = await inquirer.prompt(askId());


    // async promise awaits list of roles from role column and maps to choice list
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
        // updates employee role based on selected item in choice list
        connection.query(`UPDATE employee 
        SET role_id = ${roleId}
        WHERE employee.id = ${employeeId.name}`, async (err, res) => {
            if (err) throw err;
            console.log('Role has been updated')
            prompt();
        });
    });
}

// function includes object arrays for first and last name prompt
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