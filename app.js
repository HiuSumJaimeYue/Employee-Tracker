const inquirer = require('inquirer');
const db = require('./db/connection');
var rolesList = [];
var employeeList = [];

const employeeChoices = () => {
    const employeeQuery = `SELECT CONCAT(first_name, ' ', last_name) AS full_name FROM employees;`;

    db.query(employeeQuery, (err, row) => {
        if (err) {
            console.log(err);
        }

        console.log("\n");
        for (var i = 0; i < row.length; i++) {
            employeeList.push(row[i].full_name);
        }
    });
    return employeeList;
};


const roleChoices = () => {
    const roleQuery = `SELECT title FROM roles;`;

    db.query(roleQuery, (err, row) => {
        if (err) {
            console.log(err);
        }
        console.log("\n");
        for (var i = 0; i < row.length; i++) {
            rolesList.push(row[i].title);
        }
    });
    return rolesList;
};

const promptAction = (teamData = []) => {
    
    rolesList = [];
    employeeList = [];
    roleChoices();
    employeeChoices();

    if (!teamData.action) {
        console.log(
            "╔══════════════════╗\n" +
            "  Employer Manager\n" +
            "╚══════════════════╝\n");
    }
    return inquirer.prompt(
        [{
            type: 'list',
            name: 'actionInquirer',
            message: 'What would you like to do?',
            choices: ['View All Employees', 'Add Employee',
                'Update Employee Role', 'View All Roles', 'Add Role',
                'View All Departments', 'Add Department']
        }, {
            type: 'input',
            name: 'firstName',
            message: 'What is the employee\'s first name?',
            validate: firstNameInput => {
                if (firstNameInput) {
                    return true;
                } else {
                    console.log('Please enter a first name!');
                    return false;
                }
            },
            when: (answers) => answers.actionInquirer === 'Add Employee'
        }, {
            type: 'input',
            name: 'lastName',
            message: 'What is the employee\'s last name?',
            validate: lastNameInput => {
                if (lastNameInput) {
                    return true;
                } else {
                    console.log('Please enter a last name!');
                    return false;
                }
            },
            when: (answers) => answers.actionInquirer === 'Add Employee'
        }, {
            type: 'list',
            name: 'role',
            message: 'What is the employee\'s role?',
            choices: rolesList,
            when: (answers) => answers.actionInquirer === 'Add Employee'
        }, {
            type: 'list',
            name: 'assignedManager',
            message: 'What is the employee\'s manager?',
            choices: ['None', 'M1', 'M2', 'M3'],
            when: (answers) => answers.actionInquirer === 'Add Employee'
        }, {
            type: 'list',
            name: 'updateEmployee',
            message: 'Which employee\'s role do you want to update?',
            choices: employeeList,
            when: (answers) => answers.actionInquirer === 'Update Employee Role'
        }, {
            type: 'list',
            name: 'updateRole',
            message: 'Which role do you want to assign the selected employee?',
            choices: rolesList,
            when: (answers) => answers.actionInquirer === 'Update Employee Role'
        }, {
            type: 'input',
            name: 'newRole',
            message: 'What is the name of the role?',
            validate: newRoleInput => {
                if (newRoleInput) {
                    return true;
                } else {
                    console.log('Please enter a role!');
                    return false;
                }
            },
            when: (answers) => answers.actionInquirer === 'Add Role'
        }, {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of the role?',
            validate: salaryInput => {
                if (salaryInput) {
                    return true;
                } else {
                    console.log('Please enter a salary amount!');
                    return false;
                }
            },
            when: (answers) => answers.actionInquirer === 'Add Role'
        }, {
            type: 'list',
            name: 'roleDepartment',
            message: 'What deparatment does the role belong to?',
            choices: ['D1', 'D2', 'D3'],
            when: (answers) => answers.actionInquirer === 'Add Role'
        }, {
            type: 'input',
            name: 'newDepartmentName',
            message: 'What is the name of the department?',
            validate: newDepartmentNameInput => {
                if (newDepartmentNameInput) {
                    return true;
                } else {
                    console.log('Please enter a department name!');
                    return false;
                }
            },
            when: (answers) => answers.actionInquirer === 'Add Department'
        }]
    )
        .then(action => {
            teamData.action = action.actionInquirer;
            if (action.actionInquirer === 'View All Employees') {
                console.log("View Em");
                const sqlViewEmployee = `SELECT employees.id, employees.first_name, last_name,roles.title,
                roles.department_id, roles.salary,  employees.manager_id
                FROM employees
                LEFT JOIN roles ON employees.role_id = roles.id;`;
                db.query(sqlViewEmployee, (err, row) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log("\n");
                    console.table(row);
                    promptAction(teamData);
                });
                return;
            } else if (action.actionInquirer === 'Add Employee') {
                console.log("Add Em");
                teamData.firstName = action.firstName;
                teamData.lastName = action.lastName;
                teamData.role = action.role;
                teamData.assignedManager = action.assignedManager;
                // Create a employee
                const sqlCreateEmployee = `INSERT INTO employees (first_name, last_name, role_id, manager_id) 
                VALUES (?,?,?,?)`;
                //console.log(teamData.role);

                const params = [teamData.firstName, teamData.lastName, rolesList.indexOf(teamData.role) + 1, 5];

                db.query(sqlCreateEmployee, params, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log("Added " + teamData.firstName + " " + teamData.lastName + " to the database");
                    promptAction(teamData);
                });
                return;
            } else if (action.actionInquirer === 'Update Employee Role') {
                teamData.updateEmployee = action.updateEmployee;
                teamData.updateRole = action.updateRole;

                // Update employee's role
                const sqlUpdateEmployee = `UPDATE employees
                SET role_id =? WHERE id = ?;`;
                const paramsUpdate = [3, 1];

                db.query(sqlUpdateEmployee, paramsUpdate, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log("Updated employee\'s Role");
                    promptAction(teamData);
                });
                return;
            } else if (action.actionInquirer === 'View All Roles') {
                console.log("View Roles");
            } else if (action.actionInquirer === 'Add Role') {
                console.log("Add Ro");
                teamData.newRole = action.newRole;
                teamData.salary = action.salary;
                teamData.roleDepartment = action.roleDepartment;
            } else if (action.actionInquirer === 'View All Departments') {
                console.log("View All De");
            }
            else if (action.actionInquirer === 'Add Department') {
                console.log("Add De");
                console.log("\nAdded " + action.newDepartmentName + " to the database");
                teamData.newDepartment = action.newDepartmentName;
            }
            console.log(teamData);
            return promptAction(teamData);

        });
};


promptAction();