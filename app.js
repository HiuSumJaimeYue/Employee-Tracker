const inquirer = require('inquirer');

const promptAction = (teamData = []) => {
    if (!teamData.action) {
        console.log(
            "╔══════════════════╗\n" +
            "  Employer Manager\n" +
            "╚══════════════════╝\n");
    }
    return inquirer.prompt(
        {
            type: 'list',
            name: 'actionInquirer',
            message: 'What would you like to do?',
            choices: ['View All Employees', 'Add Employee',
                'Update Employee Role', 'View All Roles', 'Add Role',
                'View All Departments', 'Add Department']
        }
    )
        .then(action => {
            console.log(action.actionInquirer);
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
            } else if (action.actionInquirer === 'View All Departments') {
                console.log("View All De");
            }
            else if (action.actionInquirer === 'Add Department') {
                console.log("Add De");
            }
            teamData.action = action.actionInquirer;
            return promptAction(teamData);

        });
};


promptAction();