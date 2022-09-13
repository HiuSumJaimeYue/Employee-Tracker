const inquirer = require('inquirer');

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
            name: 'role',
            message: 'What is the name of the role?',
            validate: roleInput => {
                if (roleInput) {
                    return true;
                } else {
                    console.log('Please enter a role!');
                    return false;
                }
            },
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
            if (action.actionInquirer === 'View All Employees') {
                console.log("View Em");
            } else if (action.actionInquirer === 'Add Employee') {
                console.log("Add Em");
            } else if (action.actionInquirer === 'Update Employee Role') {
                console.log("Update Em Role");
            } else if (action.actionInquirer === 'View All Roles') {
                console.log("View Roles");
            } else if (action.actionInquirer === 'Add Role') {
                console.log("Add Ro");
                teamData.role = action.role;
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