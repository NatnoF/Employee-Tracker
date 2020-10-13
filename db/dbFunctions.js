const index = require("../index");

class DB
{
    viewAllEmployees()
    {
        console.log("import works\n");
        index.loadPrompts();
    }
}

module.exports = new DB();