DROP DATABASE IF EXISTS employee_tracker_db;
CREATE DATABASE employee_tracker_db;

\c employee_tracker_db;

CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    department VARCHAR(30) NOT NULL
);


CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary INTEGER,
    department INTEGER,
    FOREIGN KEY (department)
    REFERENCES departments(id)
    ON DELETE CASCADE
    
);

CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role INTEGER,
    FOREIGN KEY (role)
    REFERENCES roles(id) ON DELETE CASCADE,
    manager_id INTEGER
    REFERENCES employees(id) ON DELETE SET NULL
);