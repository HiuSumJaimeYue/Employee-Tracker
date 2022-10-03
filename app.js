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
    const managerList = employeeList;
    managerList.unshift("None");

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
            choices: managerList,//with None
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
                const sqlViewEmployee = `SELECT employees.id, employees.first_name, last_name,roles.title,
                roles.department_id, roles.salary,  employees.manager_id
                FROM employees
                LEFT JOIN roles ON employees.role_id = roles.id;`;
                db.query(sqlViewEmployee, (err, row) => {
                    if (err) {
                        console.log(err);
                    }
                    console.table(row);
                    promptAction(teamData);
                });
                return;
            } else if (action.actionInquirer === 'Add Employee') {
                teamData.firstName = action.firstName;
                teamData.lastName = action.lastName;
                teamData.role = action.role;
                teamData.assignedManager = action.assignedManager;
                // Create an employee
                const sqlCreateEmployee = `INSERT INTO employees (first_name, last_name, role_id, manager_id) 
                VALUES (?,?,?,?)`;
                let manager;

                // if (teamData.role === "None"){
                //     manager = null;
                // }else{
                manager = managerList.indexOf(teamData.assignedManager);
                if (manager === 0) {
                    manager = null;
                }
                // }
                const params = [teamData.firstName, teamData.lastName, rolesList.indexOf(teamData.role) + 1,
                    manager];
                //function for null case
                // if(teamData.assignedManager !== "None"){
                //     const params = [teamData.firstName, teamData.lastName, rolesList.indexOf(teamData.role) + 1, 
                //         employeeList.indexOf(teamData.assignedManager) + 1]; 
                // }


                db.query(sqlCreateEmployee, params, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log("Added " + teamData.firstName + " " + teamData.lastName + " to the database");
                    rolesList = [];
                    employeeList = [];
                    promptAction(teamData);
                });
                return;
            } else if (action.actionInquirer === 'Update Employee Role') {
                teamData.updateEmployee = action.updateEmployee;
                teamData.updateRole = action.updateRole;

                // Update employee's role
                const sqlUpdateEmployee = `UPDATE employees
                SET role_id =? WHERE id = ?;`;

                const paramsUpdate = [rolesList.indexOf(teamData.updateRole) + 1,
                employeeList.indexOf(teamData.updateEmployee) + 1];

                db.query(sqlUpdateEmployee, paramsUpdate, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log("Updated employee\'s Role");
                    rolesList = [];
                    employeeList = [];
                    promptAction(teamData);
                });
                return;
            } else if (action.actionInquirer === 'View All Roles') {
                const sqlViewRoles = `SELECT * FROM roles;`;
                db.query(sqlViewRoles, (err, row) => {
                    if (err) {
                        console.log(err);
                    }
                    console.table(row);
                    promptAction(teamData);
                });
                return;

            } else if (action.actionInquirer === 'Add Role') {
                teamData.newRole = action.newRole;
                teamData.salary = action.salary;
                teamData.roleDepartment = action.roleDepartment;

                // Create a role
                const sqlCreateRole = `INSERT INTO roles (title, salary, department_id) 
                VALUES (?,?,?)`;

                const params = [teamData.newRole, teamData.salary, 2];

                db.query(sqlCreateRole, params, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log("Added " + teamData.newRole + " to the database");
                    rolesList = [];
                    employeeList = [];
                    promptAction(teamData);
                });
                return;
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