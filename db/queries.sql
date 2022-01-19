-- SQL queries that will go into the .query method in employee_db.js

-- Shows all departments
SELECT id AS ID, department_name AS department FROM department;

-- Shows all roles
SELECT role.id AS ID, title, department_name AS department, salary  
FROM department
JOIN role
ON department.id = role.department_id;

--Shows all employees
SELECT employee.id, employee.first_name, employee.last_name, title, department_name AS department, salary, CONCAT (manager.first_name, " ", manager.last_name) AS manager
FROM employee
JOIN role 
ON employee.role_id = role.id
JOIN department
ON role.department_id = department.id
LEFT JOIN employee manager ON employee.manager_id = manager.id;

-- Add a new department
INSERT INTO department (department_name)
VALUES (?);

-- Add a new role
INSERT INTO role (title, salary, department_id)
VALUES(?,?,?);

-- Add a new employee
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES (?,?,?,?)
 
-- Updates employee's role
UPDATE employee 
SET role_id = ? WHERE id = ?