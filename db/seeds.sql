INSERT INTO departments (department)
VALUES  ('Sales'),
        ('Engineering'),
        ('Construction'),
        ('Finance'),
        ('Legal');


INSERT INTO roles (title, salary,department)
VALUES  ('Software Engineer' , 120000, 2),
        ('Salesperson', 80000, 1);

INSERT INTO employees (first_name, last_name,role,manager_id)
VALUES  ('John' , 'Doe',1,NULL),
        ('Peter', 'Parker',2,1);