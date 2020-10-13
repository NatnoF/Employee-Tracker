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
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++)
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
        connection.query('SELECT e.id, CONCAT(m.first_name, " ", m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON e.Manager_id = m.id', function (err, results)
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
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++)
                        {
                            if (results[i].Manager != null)
                            {
                                choiceArray.push({ name: results[i].Manager, value: results[i].id });
                            }
                        }
                        return choiceArray;
                    }
                }
            )
            .then(function(answer)
            {
                var query = `SELECT e.id, e.first_name AS First_Name, e.last_name AS Last_Name, CONCAT(m.first_name, " ", m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON e.Manager_id = m.id WHERE e.id = ${answer.choice};`
                connection.query(query, function(err, res)
                {
                    if (err) throw err;

                    console.table(res);
                    index.loadPrompts();
                });
            });
        });
    }

    addEmployee()
    {

    }

    addEmployeeRole()
    {

    }
}

module.exports = new DB();