const inquirer = require('inquirer');
const db = require('./db/connection');

const promptAction = (teamData = []) => {
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
            choices: ['R1', 'R2', 'R3'],
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
            choices: ['E1', 'E2', 'E3'],
            when: (answers) => answers.actionInquirer === 'Update Employee Role'
        }, {
            type: 'list',
            name: 'updateRole',
            message: 'Which role do you want to assign the selected employee?',
            choices: ['R1', 'R2', 'R3'],
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
                    console.log("\nAdded " + newDepartmentNameInput + " to the database");
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
            if (action.actionInquirer === 'View All Employees') {
                console.log("View Em");
                db.query(`SELECT * FROM employees`, (err, row) => {
                    if (err) {
                        console.log(err);
                    }
                    console.table(row);
                });
                // async function viewEmDisplay() {
                //     let viewEmPromise = new Promise(function (resolve, reject) {
                //         db.query(`SELECT * FROM employees`, (err, row) => {
                //             if (err) {
                //                 reject(err);
                //             }
                //             resolve(row);
                //         })
                //     });
                //     console.table(viewEmPromise);
                // };
                // viewEmDisplay();
            } else if (action.actionInquirer === 'Add Employee') {
                console.log("Add Em");
                teamData.firstName = action.firstName;
                teamData.lastName = action.lastName;
                teamData.role = action.role;
                teamData.assignedManager = action.assignedManager;
            } else if (action.actionInquirer === 'Update Employee Role') {
                teamData.updateEmployee = action.updateEmployee;
                teamData.updateRole = action.updateRole;
                console.log("Updated employee\'s Role");
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
                teamData.newDepartment = action.newDepartmentName;
            }
            teamData.action = action.actionInquirer;
            console.log(teamData);
            return promptAction(teamData);

        });
};


promptAction();