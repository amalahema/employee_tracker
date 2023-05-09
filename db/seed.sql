USE employeeDB;


INSERT INTO department (name)
VALUES ('Engineering'), ('Sales'), ('Legal'), ('Finance');

INSERT INTO role (title, salary, department_id)
VALUES 
  ("Sales Lead", 100000, 1),
  ("Salesperson" , 80000, 1),
  ("Lead Engineer", 150000, 2),
  ("Software Engineer", 120000, 2),
  ("Account Manager" , 160000, 3),
  ("Accountant", 125000,3),
  ("Legal Team Lead", 250000, 4);
  ("Lawyer" , 190000, 4)


  
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Mike", "Chan", 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Ashley", "Rodriguez", 3, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Kevin", "Tupik", 4, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Kunal", "Singh", 5, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Malia", "Brown", 2, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Sarah", "Lourd", 4, 7);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Tom", "Allen", 1, 2);