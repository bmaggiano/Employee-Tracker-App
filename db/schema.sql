DROP DATABASE IF EXISTS employee_tracker;
CREATE DATABASE employee_tracker;
USE employee_tracker;

CREATE TABLE department (
    id INT NOT NULL AUTO INCREMENT PRIMARY,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
    id INT NOT NULL AUTO INCREMENT PRIMARY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id)
    REFERENCES (department(id))
    ON DELETE SET NULL
);

CREATE TABLE employee (
    id INT NOT NULL AUTO INCREMENT PRIMARY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT REFERENCES (id),
    FOREIGN KEY (role_id)
    REFERENCES (roles(id))
    ON DELETE SET NULL
);
