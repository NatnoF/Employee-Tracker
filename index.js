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

            case "EXIT":
                return connection.end();
        }
    });
}

module.exports.loadPrompts = loadPrompts;