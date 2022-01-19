INSERT INTO department (department_name)
VALUES ("Finance"),
       ("Legal"),
       ("Engineering"),
       ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES ("Financial Analyst", 109000, 1 ),
       ("Web Developer", 80000, 3), 
       ("Accountant", 75000, 1),
       ("Lawyer", 95000, 2),
       ("Paralegal", 50000, 2),
       ("IT Specialist", 85000, 3),
       ("Marketing Coordinator", 75000, 4),
       ("Product Manager", 80000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Meadow", "Hart", 4, 4),
       ("Veronica", "Alvarez", 8, 8),
       ("Kelly", "Tran", 5, NULL),
       ("Gabriel", "Jones", 1, 1),
       ("Marcos", "Morales", 2, 2),
       ("Maxwell", "Smart", 3, NULL), 
       ("Sierra", "Johnson", 6, NULL),
       ("Alan", "White", 7, NULL);