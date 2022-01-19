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
}