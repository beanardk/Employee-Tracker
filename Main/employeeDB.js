require('dotenv').config();

const mysql = require('mysql2');
const mysqlPromise = require('mysql2/promise');
const inquirer = require('inquirer');
const cTable = require('console.table')

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
    console.log(`Connected to the employee_db database`)
);

db.connect(err => {
    if(err) throw err;
    afterConnection();
});

afterConnection = () => {
    console.log("***********************************")
    console.log("*                                 *")
    console.log("*        EMPLOYEE MANAGER         *")
    console.log("*                                 *")
    console.log("***********************************")
    promptUser();
}

const promptUser = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'choices',
            message: 'What would you like to do?',
            choices: [
              'View all departments',
              'View all roles',
              'View all employees',
              'Add a department',
              'Add a role',
              'Add an employee',
              'Update an employee role',
              'No action'
            ]
        }
    ])

    .then((answers) => {
        const{choices} = answers;
        if(choices === 'View all departments') {
            showDepartments();
        }
    
        if(choices === 'View all roles') {
            showRoles(); 
        }
    
        if(choices === 'View all employees') {
            showEmployees();
        }
    
        if(choices === 'Add a department') {
            addDepartment();
        }
    
        if (choices === 'Add a role') {
            addRole();
          }
      
          if (choices === 'Add an employee') {
            addEmployee();
          }
      
          if (choices === 'Update an employee role') {
            updateEmployee();
          }
      
          if (choices === 'No action') {
            db.end()
          };
    });
};

function showDepartments() {
    console.log('Showing all departments...\n');
    const sql = `SELECT id AS ID, department_name AS department FROM department;`; 
  
    db.query(sql, (err, rows) => {
      if (err) throw err;
    
      console.table(rows);
    
    
      promptUser();
    });
  };

  function showRoles() {
    console.log('Showing all roles...\n');

    const sql = `SELECT role.id AS ID, title, department_name AS department, salary  
    FROM department
    JOIN role
    ON department.id = role.department_id;`
  
    db.query(sql, (err, rows) => {
      if (err) throw err;
      console.table(rows);
      promptUser();
    });
  };
  
  
  function showEmployees() {
    console.log('Showing all employees...\n');
  
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, title, department_name AS department, salary, CONCAT (manager.first_name, " ", manager.last_name) AS manager
    FROM employee
    JOIN role 
    ON employee.role_id = role.id
    JOIN department
    ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id;`; 
  
    db.query(sql, (err, rows) => {
      if (err) throw err;
      console.table(rows);
      promptUser();
    });
  };
  
  
  function addDepartment() {
    inquirer.prompt([
      {
        type:'input',
        name:'addDept',
        message:'What department do you want to add?',
      }
    ])
    .then(answer => {
      const sql = `INSERT INTO department (department_name)
                   VALUES (?)`;
      db.query(sql, answer.addDept, (err,result) => {
        if(err) throw err;
        console.log(`Added ${answer.addDept} to departments`);
        showDepartments();
      }) ;         
    });
  };
  
  
  function addRole() {
    inquirer.prompt([
      {
        type:'input',
        name:'role',
        message:'What role do you want to add?'
      },
      {
        type: 'input',
        name: 'salary',
        message:'What is the salary of this role?'
      }
    ])
    .then(answer => {
      const params = [answer.role, answer.salary];
      const roleSql = `SELECT department_name, id FROM department`;
  
      db.query(roleSql, (err,data) => {
        if (err) throw err;
        const dept = data.map(({department_name, id}) => ({department_name: department_name, value: id}));
  
        inquirer.prompt([
          {
            type:'list',
            name:'dept',
            message:'What department is this role in?',
            choices: dept
          }
        ])
          .then(deptChoice => {
            const dept = deptChoice.dept;
            params.push(dept);
          
            const sql = `INSERT INTO role (title, salary, department_id)
                         VALUES(?,?,?)`;
                         
            db.query(sql, params, (err,result) => {
              if(err) throw err;
              console.log(`Added ${answer.role} to roles.`);
              showRoles();
            });
          });
      });
    });
  };
  
  
  function addEmployee() {
    inquirer.prompt([
      {
        type:'input',
        name:'firstName',
        message:"What is the employee's first name?"
      },
      {
        type:'input',
        name:'lastName',
        message:"What is the employee's last name?"
      }
    ])
    .then(answer => {
      const params = [answer.firstName, answer.lastName]
  
      const roleSql = `SELECT role.id, role.title FROM role`;
  
      db.query(roleSql, (err,data) => {
        if(err) throw err;
  
        const roles = data.map(({id,title}) => ({name:title, value:id}));
        
        inquirer.prompt([
          {
            type:'list',
            name:'role',
            message:"What is the employee's role?",
            choices: roles
          }
        ])
        .then(roleChoice => {
          const role = roleChoice.role;
          params.push(role);
  
          const managerSql = `SELECT * FROM employee`;
  
          db.query(managerSql, (err,data) => {
            if (err) throw err;
  
            const managers = data.map(({id, first_name, last_name})=>({name: `${first_name} ${last_name}`, value:id}));
  
            inquirer.prompt([
              {
                type:'list',
                name:'manager',
                message:"Who is the employee's manager?",
                choices: managers
              }
            ])
            .then(managerChoice => {
              const manager = managerChoice.manager;
              params.push(manager);
              
              const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                           VALUES (?,?,?,?)`;
  
              db.query(sql, params, (err,result) => {
                if(err) throw err;
                console.log("Employee has been added.")
  
                showEmployees();
              });
            });
          });
        });
      });
    });
  };
  
  
  function updateEmployee() {
    const employeeSql = `SELECT * FROM employee`;
  
    db.query(employeeSql, (err, data) => {
      if(err) throw err;
  
      const employees = data.map(({id, first_name, last_name}) => ({name: `${first_name} ${last_name}`, value:id}));
  
      inquirer.prompt([
        {
          type:'list',
          name:'name',
          message:'Which employee would you like to update?',
          choices: employees
        }
      ])
      .then(empChoice => {
        const employee = empChoice.name;
        const params = [];
        params.push(employee);
  
        const roleSql = `SELECT * FROM role`;
  
        db.query(roleSql, (err, data) => {
          if (err) throw err;
  
          const roles = data.map(({id,title}) => ({name: title, value: id}));
  
          inquirer.prompt([
            {
              type:'list',
              name:'role',
              message:"What is the employee's new role?",
              choices:roles
            }
          ])
          .then(roleChoice => {
            const role = roleChoice.role;
            params.push(role);
  
            let employee = params[0]
            params[0] = role
            params[1] = employee
  
            const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
  
            db.query(sql,params, (err,result) => {
              if(err) throw err;
              console.log('Employee has been updated.');
  
              showEmployees();
            });
          });
        });
      });
    });
  };