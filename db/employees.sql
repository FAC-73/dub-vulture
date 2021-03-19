-- if database already exists do not create --
DROP DATABASE IF EXISTS employees;

-- else create database employees --
CREATE DATABASE employees;

-- use database employees --
USE employees;

-- create a table called department --
CREATE TABLE department (

  -- add id and auto increment with number set as primary key --
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

  -- add column called name with up to 30 characters must be unique and not left empty --
  name VARCHAR(30) UNIQUE NOT NULL
);

-- create a table called role --
CREATE TABLE role (
  -- add id and auto increment with number set as primary key --
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  
  -- add column called title with up to 30 characters must be unique and not left empty --
  title VARCHAR(30) UNIQUE NOT NULL,
  
  -- add column called salary with decimals cannot be left empty --
  salary DECIMAL UNSIGNED NOT NULL,
  
  -- add column called department_id with decimals cannot be left empty --
  department_id INT UNSIGNED NOT NULL,
  
  -- add column called department_id with decimals cannot be left empty --
  INDEX dep_ind (department_id),
  
  -- add foreign key constraint for department_id column --
  CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

-- create a table called employee --
CREATE TABLE employee (
  -- add id and auto increment with number set as primary key --
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  
  -- add column called first_name with up to 30 characters cannot be left empty --
  first_name VARCHAR(30) NOT NULL,
  
  -- add column called flast_name with up to 30 characters cannot be left empty --
  last_name VARCHAR(30) NOT NULL,
  
  -- add column called role_id that only stores positive numbers --
  role_id INT UNSIGNED NOT NULL,
  
  -- add index for role id column --
  INDEX role_ind (role_id),
  
   -- add foreign key constraint for role_id column --
  CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
  
  -- add column called manager_id that only stores positive numbers --
  manager_id INT UNSIGNED,
  
  -- add index for manager_id column --
  INDEX man_ind (manager_id),
  
 -- add foreign key constraint for department_id column --
  CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);

-- use employees database
use employees;

-- insert data into department table
INSERT INTO department
    (name)
VALUES
    ('Design'),
    ('Engineering'),
    ('Product Management'),
    ('Marketing');
    
-- insert data into role table 
INSERT INTO role
    (title, salary, department_id)
    
-- insert column content: title, salary, department and id
VALUES
    ('Principal Product Designer', 14000000, 1),
    ('Interaction Designer', 8000000, 1),
    ('Senior Developer', 18000000, 2),
    ('Developer', 9000000, 2),
    ('Principal Product Manager', 18000000, 3),
    ('Product Manager', 10000000, 3),
    ('Partner', 45000000, 4),
    ('Marketing Executive', 25000000, 4);
    
-- insert data into employee table 
INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
    
-- insert column content: first_name, last_name, role id, manager, id
VALUES
    ('Kent', 'Dennis', 1, NULL),
    ('Ricardo', 'Walsh', 2, 1),
    ('Sheldon', 'Ballard', 3, NULL),
    ('Robin', 'Harrison', 4, 3),
    ('Mary', 'Schneider', 5, NULL),
    ('Rosa', 'Cross', 6, 5),
    ('Dianne', 'Roberts', 7, NULL),
    ('Johnathan', 'Harmon', 8, 7);