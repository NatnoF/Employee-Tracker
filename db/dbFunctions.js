const index = require("../index");
const connection = require("./connection");

class DB
{
    viewAllEmployees()
    {
        var query = 'SELECT e.id, e.first_name AS First_Name, e.last_name AS Last_Name, title AS Title, salary AS Salary, name AS Department, CONCAT(m.first_name, " ", m.last_name) AS Manager '
        query += 'FROM employee e LEFT JOIN employee m ON e.manager_id = m.id LEFT JOIN role r ON e.role_id = r.id LEFT JOIN department d ON r.department_id = d.id'
        

        connection.query(query, function(err, res)
        {
            console.log("\n");
            console.table(res);
            console.log("\n");
        })

        index.loadPrompts();
    }

    viewEmployeesByDepartment()
    {

    }

    viewEmployeesByManager()
    {

    }

    addEmployee()
    {

    }

    addEmployeeRole()
    {
        
    }
}

module.exports = new DB();