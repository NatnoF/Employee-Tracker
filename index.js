// Require Statements
const inquirer = require("inquirer");
const connection = require("./db/connection");
const logo = require("asciiart-logo");
const DB = require("./db/dbFunctions");

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    init();
});


// Function init()
function init()
{
    const loogText = logo({ name: "Employee Manager"}).render();
    console.log(loogText);

    // Load our prompts
    loadPrompts();
}

function loadPrompts()
{
    inquirer.prompt
    (
        {
            type: "list",
            name: "choice",
            message: "What would you like to do?",
            choices: 
            [
                {
                    name: "View All Employees",
                    value: "VIEW_EMPLOYEES"
                },
                {
                    name: "View All Employees By Department",
                    value: "VIEW_EMPLOYEES_DEPARTMENT"
                },
                {
                    name: "View All Employees By Manager",
                    value: "VIEW_EMPLOYEES_MANAGER"
                },
                {
                    name: "View All Roles",
                    value: "VIEW_ROLES"
                },
                {
                    name: "Add Employee",
                    value: "ADD_EMPLOYEE"
                },
                {
                    name: "Add Employee Role",
                    value: "ADD_EMPLOYEE_ROLE"
                },
                {
                    name: "Update Employee Role",
                    value: "UPDATE_ROLE"
                },
                {
                    name: "Exit",
                    value: "EXIT"
                }
            ]
        }
    )
    .then(function(answer)
    {
        switch(answer.choice)
        {
            case "VIEW_EMPLOYEES":
                return DB.viewAllEmployees();

            case "VIEW_EMPLOYEES_DEPARTMENT":
                return DB.viewEmployeesByDepartment();

            case "VIEW_EMPLOYEES_MANAGER":
                return DB.viewEmployeesByManager();

            case "VIEW_ROLES":
                return DB.viewAllRoles();

            case "UPDATE_ROLE":
                return DB.updateEmployeeRole();

            case "ADD_EMPLOYEE":
                return DB.addEmployee();

            case "ADD_EMPLOYEE_ROLE":
                return DB.addEmployeeRole();

            case "EXIT":
                return connection.end();
        }
    });
}

module.exports.loadPrompts = loadPrompts;