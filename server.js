//add all the dependecies

const inquirer = require("inquirer");
const mysql = require("mysql");
require("console.table")


//establish the mysql connection

const connection = mysql.createConnection({

    host: 'localhost',
    port: 3306,//special port number for mysql
    username:'root',
    password:'',
    database:''
});

// if error in connection
connection.connect(function (err) {
    if (err) throw err;
    console.log("connection ");
    //function name for prompt
});

//create the function for user prompt

function promptUser()
{
    inquirer.prompt({
        //set the list of questions
        //name given as selectedChoice 
        //message  is as usaual what u like to show
        type: "list",
        name: selectedChoice,
        message: "What would you like to do?",
        //list of questios set as an array
        Choices: [
            "View Employees",
            "View Employees by Department",
            "Add Employee",
            "Remove Employees",
            "Update EmployeeRole",
            "Add NewRole",
            "End"

       ]
    })
    .then (function({selectedChoice}){
       switch(selectedChoice)
       {
        case "View Employees":
          viewEmployee();
          break;

        case "View Employees by Department":
          viewEmployeeByDepartment();
          break;
      
        case "Add Employee":
          addEmployee();
          break;

        case "Remove Employees":
          removeEmployees();
          break;

        case "Update EmployeeRole":
          updateEmployeeRole();
          break;

        case "Add NewRole":
          addRole();
          break;

        case "End":
          connection.end();
          break;
       }
    });
}

//function for each selectedChoice

    function viewEmployee()
    {

    }
    function viewEmployeeByDepartment()
    {

    }
    function addEmployee()
    {

    }

    function removeEmployees()
    {

    }

    function updateEmployeeRole()
    {

    }

    function end()
    {

    }

