//add all the dependecies

const inquirer = require("inquirer");
const mysql = require("mysql2");
require("console.table")


//establish the mysql connection

const connection = mysql.createConnection({

  host: "localhost",
  user: "root",
  password: "",
  database: "employeeDB",
  port : "3306"
});


connection.connect(function (err) {
    if (err) throw err;
    console.log("connection success");
    promptUser();
    //call the function after the connection established
});


//create the function for user prompt
function promptUser()
{
    inquirer.prompt({
        //set the list of questions
        //name given as selectedChoice 
        //message  is as usaual what u like to show
        type: "list",
        name: "selectedChoice",
        message: "What would you like to do?",

        //list of questios set as an array
        choices: [
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
//view all employees and add somemore details using left join from other table having id as the common value of the relationship between the tables

    function viewEmployee()
    {
        console.log("EMPLOYEE DETAILS \n");
        var query = 
        `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
        FROM employee e
        LEFT JOIN role r ON e.role_id = r.id
        LEFT JOIN department d ON d.id = r.department_id
        LEFT JOIN employee m ON m.id = e.manager_id`
        
        connection.query(query, function (err, res) {
            if (err) throw err;
            console.table(res);
            console.log("Employee deatils are viewed\n");       
            promptUser();
          });
    }
    function viewEmployeeByDepartment()
    {   
       console.log("EMPLOYEE DETAILS BY DEPARTMENT\n")
       //this query based on the challenge to realte between 2 tables
       var query =
        `SELECT d.id, d.name, MAX(r.salary) AS budget
       FROM employee e
       LEFT JOIN role r ON e.role_id = r.id
       LEFT JOIN department d ON d.id = r.department_id
       GROUP BY d.id, d.name`

       connection.query(query, function (err, res) {
         if (err) throw err;
         //data : represents each row in the result set.
         //id   : is the column id of the row
         //name : is  the  column name of the row
         //map  : creates a new array  
         //the res represent each row in the array
         //map function iterates over an array and transform the data into object with value and name properties         
         const departmentChoices = res.map(data => ({
          value: data.id, name: data.name
        }));
    
        console.table(res);
        console.log("Employee details are viewed by department \n");
        selectedDepartment(departmentChoices);//array of the selected department
      });
    }

    // User choose the department list, then employees pop up
    function selectedDepartment(departmentChoices) {
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
            var query =
            `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department FROM employee e
            JOIN role r
            ON e.role_id = r.id
            JOIN department d
            ON d.id = r.department_id
            WHERE d.id = ?`
            connection.query(query, answer.departmentId, function (err, res) {
              if (err) throw err;
              console.table("Fetched details shown as the response ", res);
              console.log(res.affectedRows + "Employees are viewed!\n");    
              promptUser();
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
        console.log("New employee role inserted");
        employeeRoleInsert(roleChoices);
      });
      }
      function employeeRoleInsert(roleChoices) {

        inquirer
          .prompt([
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
              name: "roleId",
              message: "What is the employee's role?",
              choices: roleChoices
            },
          ])
          .then(function (answer) {
            console.log(answer);
      
            var query = `INSERT INTO employee SET ?`
            //  insert a new employee details
            connection.query(query,
              {
                first_name: answer.first_name,
                last_name: answer.last_name,
                role_id: answer.roleId,
                manager_id: answer.managerId,
              },
              function (err, res) {
                if (err) throw err;
      
                console.table(res);
                console.log(res.affectedRows  +  "Inserted successfully!\n");
      
                promptUser();
              });
          });
      }
    function removeEmployees()
    {
        console.log("Deleting an employee");

        var query =
          `SELECT e.id, e.first_name, e.last_name
            FROM employee e`
      
        connection.query(query, function (err, res) {
          if (err) throw err;
      
          const deleteEmployeeChoices = res.map(({ id, first_name, last_name }) => ({
            value: id, name: `${id} ${first_name} ${last_name}`
          }));
      
          console.table(res);
          console.log("This employee details is in delete function\n");
      
          promptDelete(deleteEmployeeChoices);
        });
    }
    // User choose the employee list, then employee is deleted
function promptDelete(deleteEmployeeChoices) {

    inquirer
      .prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Which employee do you want to remove?",
          choices: deleteEmployeeChoices
        }
      ])
      .then(function (answer) {
  
        var query = `DELETE FROM employee WHERE ?`;
        // when finished prompting, insert a new item into the db with that info
        connection.query(query, { id: answer.employeeId }, function (err, res) {
          if (err) throw err;
  
          console.table(res);
          console.log(res.affectedRows + "Deleted!\n");
  
          promptUser();
        });
      });
  }

    function updateEmployeeRole()
    {
        employeeArray();
    }

    function employeeArray() {
        console.log("Updating an employee");
      
        var query =
          `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
        FROM employee e
        JOIN role r
          ON e.role_id = r.id
        JOIN department d
        ON d.id = r.department_id
        JOIN employee m
          ON m.id = e.manager_id`
      
        connection.query(query, function (err, res) {
          if (err) throw err;
      
          const employeeChoices = res.map(({ id, first_name, last_name }) => ({
            value: id, name: `${first_name} ${last_name}`      
          }));
      
          console.table(res);
          console.log("employeeDetails updated!\n")
      
          roleArray(employeeChoices);
        });
      }
      
      function roleArray(employeeChoices) {
        console.log("Updating an role");
      
        var query =
          `SELECT r.id, r.title, r.salary 
        FROM role r`
        let roleChoices;
      
        connection.query(query, function (err, res) {
          if (err) throw err;
      
          roleChoices = res.map(({ id, title, salary }) => ({
            value: id, title: `${title}`, salary: `${salary}`      
          }));
      
          console.table(res);
          console.log("roleArray to Update!\n")
      
          promptEmployeeRole(employeeChoices, roleChoices);
        });
      }
      
      function promptEmployeeRole(employeeChoices, roleChoices) {
      
        inquirer
          .prompt([
            {
              type: "list",
              name: "employeeId",
              message: "Which employee do you want to set with the role?",
              choices: employeeChoices
            },
            {
              type: "list",
              name: "roleId",
              message: "Which role do you want to update?",
              choices: roleChoices
            },
          ])
          .then(function (answer) {
      
            var query = `UPDATE employee SET role_id = ? WHERE id = ?`
            // when finished prompting, insert a new item into the db with that info
            connection.query(query,
              [ answer.roleId,  
                answer.employeeId
              ],
              function (err, res) {
                if (err) throw err;
      
                console.table(res);
                console.log(res.affectedRows + "Updated successfully!");
      
                promptUser();
              });
          });
      }
      
      //"Add Role" / CREATE: INSERT INTO
function addRole() {

    var query =
    `SELECT d.id, d.name, r.salary AS budget
    FROM employee e
    JOIN role r ON e.role_id = r.id
    JOIN department d ON d.id = r.department_id
    GROUP BY d.id, d.name, r.salary`
  
    connection.query(query, function (err, res) {
      if (err) throw err;
  
      // (callbackfn: (value: T, index: number, array: readonly T[]) => U, thisArg?: any)
      const departmentChoices = res.map(({ id, name }) => ({
        value: id, name: `${id} ${name}`
      }));
  
      console.table(res);
      console.log("Department array!");
  
      promptAddRole(departmentChoices);
    });
  }
  
  function promptAddRole(departmentChoices) {
  
    inquirer
      .prompt([
        {
          type: "input",
          name: "roleTitle",
          message: "Role title?"
        },
        {
          type: "input",
          name: "roleSalary",
          message: "Role Salary"
        },
        {
          type: "list",
          name: "departmentId",
          message: "Department?",
          choices: departmentChoices
        },
      ])
      .then(function (answer) {
  
        var query = `INSERT INTO role SET ?`
  
        connection.query(query, {
          title: answer.title,
          salary: answer.salary,
          department_id: answer.departmentId
        },
          function (err, res) {
            if (err) throw err;
  
            console.table(res);
            console.log("Role Inserted!");
  
            promptUser();
          });
  
      });
  }
      
    
