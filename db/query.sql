SELECT
departments.id,
departments.department AS departments
FROM departments;

SELECT 
    roles.id,
    roles.title,
    departments.department,
    roles.salary
FROM roles
JOIN departments ON departments.id = roles.department;

SELECT
    e.id AS employee_id,
    e.first_name AS first_name,
    e.last_name AS last_name,
    roles.title AS title,
    roles.salary AS salary,
    departments.department AS department,
    CONCAT(m.first_name, ' ', m.last_name) AS manager
   
    
    FROM employees e
    JOIN roles ON roles.id = e.role
    JOIN departments ON departments.id = roles.department
    LEFT JOIN employees m ON e.manager_id = m.id;
