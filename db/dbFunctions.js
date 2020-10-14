const index = require("../index");
const connection = require("./connection");
const inquirer = require("inquirer");

class DB
{
    viewAllEmployees()
    {
        var query = 'SELECT e.id, e.first_name AS First_Name, e.last_name AS Last_Name, title AS Title, salary AS Salary, name AS Department, CONCAT(m.first_name, " ", m.last_name) AS Manager '
        query += 'FROM employee e LEFT JOIN employee m ON e.Manager_id = m.id LEFT JOIN role r ON e.role_id = r.id LEFT JOIN department d ON r.department_id = d.id'
        

        connection.query(query, function(err, res)
        {
            if (err) throw err;

            console.table(res);

            index.loadPrompts();
        });
    }

    viewEmployeesByDepartment()
    {
        connection.query("SELECT name FROM department", function (err, results)
        {
            if (err) throw err;

            inquirer.prompt
            (
                {
                    type: "list",
                    name: "choice",
                    message: "What department do you want to search by?",
                    choices: function()
                    {
                        let choiceArray = [];
                        for (let i = 0; i < results.length; i++)
                        {
                            choiceArray.push(results[i].name);
                        }
                        return choiceArray;
                    }
                }
            )
            .then(function(answer)
            {
                var query = `SELECT e.id, e.first_name AS First_Name, e.last_name AS Last_Name, name AS Department FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id WHERE d.name = "${answer.choice}";`
                connection.query(query, function(err, res)
                {
                    if (err) throw err;

                    console.table(res);
                    index.loadPrompts();
                });
            });
        });
    }

    viewEmployeesByManager()
    {
        connection.query('SELECT m.id, CONCAT(m.first_name, " ", m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON e.Manager_id = m.id', function (err, results)
        {
            if (err) throw err;

            inquirer.prompt
            (
                {
                    type: "list",
                    name: "choice",
                    message: "Which manager do you want to search by?",
                    choices: function()
                    {
                        let choiceArray = [];
                        let valArr = []
                        for (let i = 0; i < results.length; i++)
                        {
                            if (results[i].Manager != null && !(valArr.includes(results[i].id)))
                            {
                                choiceArray.push({ name: results[i].Manager, value: results[i].id });
                                valArr.push(results[i].id);
                            }
                        }
                        return choiceArray;
                    }
                }
            )
            .then(function(answer)
            {
                var query = `SELECT e.id, e.first_name AS First_Name, e.last_name AS Last_Name, CONCAT(m.first_name, " ", m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON e.Manager_id = m.id WHERE m.id = ${answer.choice};`
                connection.query(query, function(err, res)
                {
                    if (err) throw err;

                    console.table(res);
                    index.loadPrompts();
                });
            });
        });
    }

    viewAllRoles()
    {
        connection.query('SELECT r.id, r.title AS Title, r.salary AS Salary, name AS Department FROM role r LEFT JOIN department d ON department_id = d.id', function (err, results)
        {
            if (err) throw err;

            console.table(results);
            index.loadPrompts();
        });
    }

    addEmployee()
    {
        // Building the array of role choices ahead of time
        const roles = [];
        connection.query("SELECT * FROM role", function (err, results)
        {
            if (err) throw err;

            for (let i = 0; i < results.length; i++)
            {
                roles.push({ name: results[i].title, value: results[i].id });
            }
        });

        // Building the array of manager choices ahead of time
        const managers = [];
        connection.query('SELECT m.id, CONCAT(m.first_name, " ", m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON e.Manager_id = m.id', function (err, results)
        {
            if (err) throw err;

            for (let i = 0; i < results.length; i++)
            {
                if (results[i].Manager != null)
                {
                    managers.push({ name: results[i].Manager, value: results[i].id });
                }
            }
        });

        inquirer.prompt(
            [
                {
                    type: "input",
                    name: "first_name",
                    message: "What is the employee's first name?"
                },
                {
                    type: "input",
                    name: "last_name",
                    message: "What is the employee's last name?"
                },
                {
                    type: "list",
                    name: "roleChoice",
                    message: "What is the employee's role?",
                    choices: roles
                },
                {
                    type: "list",
                    name: "managerChoice",
                    message: "Who is the employee's manager?",
                    choices: managers
                }
            ]
        )
        .then(function(answer)
        {
            let query = "INSERT INTO employee SET ?";
            connection.query(query,
                {
                    first_name: answer.first_name,
                    last_name: answer.last_name,
                    role_id: answer.roleChoice,
                    manager_id: answer.managerChoice
                });
            console.log(`Added ${answer.first_name} ${answer.last_name} to the database!`);
            index.loadPrompts();
        });
    }

    addEmployeeRole()
    {
        // Building Department array ahead of time
        const departments = [];
        connection.query("SELECT * FROM department", function (err, results)
        {
            if (err) throw err;

            for (let i = 0; i < results.length; i++)
            {
                departments.push({ name: results[i].name, value: results[i].id });
            }
        });

        inquirer.prompt(
            [
                {
                    type: "input",
                    name: "title",
                    message: "What is the role's title?"
                },
                {
                    type: "input",
                    name: "salary",
                    message: "What is the role's salary?"
                },
                {
                    type: "list",
                    name: "departmentChoice",
                    message: "What is the role's department?",
                    choices: departments
                }
            ]
        )
        .then(function(answer)
        {
            let query = "INSERT INTO role SET ?";
            connection.query(query,
                {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: answer.departmentChoice
                });

            console.log(`Added the role of ${answer.title} to the database!`);
            index.loadPrompts();
        });
    }

    addDepartment()
    {
        inquirer.prompt(
            {
                type: "input",
                name: "name",
                message: "What is the department's name?"
            }
        )
        .then(function(answer)
        {
            let query = "INSERT INTO department SET ?";
            connection.query(query, {name: answer.name});

            console.log(`Added the department of ${answer.name} to the database!`);
            index.loadPrompts();
        });
    }

    updateEmployeeRole()
    {
        // Building roles array ahead of time
        const roles = [];
        connection.query("SELECT * FROM role", function (err, results)
        {
            if (err) throw err;

            for (let i = 0; i < results.length; i++)
            {
                roles.push({name: results[i].title, value: results[i].id });
            }
        });

        // Building Employees array ahead of time
        const employees = [];
        connection.query("SELECT * FROM employee", function(err,results)
        {
            if (err) throw err;

            for (let i = 0; i < results.length; i++)
            {
                employees.push({ name: results[i].first_name + " " + results[i].last_name, value: results[i].id });
            }
        });

        inquirer.prompt(
            [
                {
                    type: "input",
                    name: "test",
                    message: "Hit enter to continue."
                },
                {
                    type: "list",
                    name: "employeeChoice",
                    message: "Which employee do you want to update?",
                    choices: employees
                },
                {
                    type: "list",
                    name: "roleChoice",
                    message: "Which role do you want to give them?",
                    choices: roles
                }
            ]
        )
        .then(function(answer)
        {
            let query = "UPDATE employee SET role_id = ? WHERE id = ?";
            connection.query(query, [answer.roleChoice, answer.employeeChoice]);

            console.log(`The employee has been updated!`);
            index.loadPrompts();
        });
    }
}

module.exports = new DB();