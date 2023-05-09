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
        console.log("EMPLOYEE DETAILS");
        var query = 
        `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
        FROM employee e
        LEFT JOIN role r ON e.role_id = r.id
        LEFT JOIN department d ON d.id = r.department_id
        LEFT JOIN employee m ON m.id = e.manager_id`
        
        connection.query(query, function (err, res) {
            if (err) throw err;
            console.table(res);
            console.log("Employees viewed!\n");       
            promptUser();
          });
    }
    function viewEmployeeByDepartment()
    {   
       console.log("EMPLOYEE DETAILS BY DEPARTMENT\n")
       var query =
        `SELECT d.id, d.name, r.salary AS budget
       FROM employee e
       LEFT JOIN role r ON e.role_id = r.id
       LEFT JOIN department d ON d.id = r.department_id
       GROUP BY d.id, d.name`

       connection.query(query, function (err, res) {
         if (err) throw err;
         const departmentChoices = res.map(data => ({
          value: data.id, name: data.name
        }));
    
        console.table(res);
        console.log("Department view succeed!\n");
    
        promptDepartment(departmentChoices);
      });
    }
    // User choose the department list, then employees pop up
    function promptDepartment(departmentChoices) {

        inquirer
          .prompt([
            {
              type: "list",
              name: "departmentId",
              message: "Which department would you choose?",
              choices: departmentChoices
            }
          ])
          .then(function (answer) {
            console.log("answer ", answer.departmentId);
      
            var query =
            `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department 
            FROM employee e
            JOIN role r
              ON e.role_id = r.id
            JOIN department d
            ON d.id = r.department_id
            WHERE d.id = ?`
            connection.query(query, answer.departmentId, function (err, res) {
              if (err) throw err;
      
              console.table("response ", res);
              console.log(res.affectedRows + "Employees are viewed!\n");
      
              firstPrompt();
            });
          });
      }

   // Make a employee array
    function addEmployee() {
        console.log("Inserting an employee!")
  
        var query =
         `SELECT r.id, r.title, r.salary FROM role r`
  
        connection.query(query, function (err, res) {
         if (err) throw err;
        const roleChoices = res.map(({ id, title, salary }) => ({
        value: id, title: `${title}`, salary: `${salary}`
        }));
  
        console.table(res);
        console.log("RoleToInsert!");
        promptInsert(roleChoices);
      });
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

