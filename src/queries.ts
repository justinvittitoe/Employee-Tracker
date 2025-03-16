import { QueryResult } from 'pg';
import { db } from './db.js';
import { error } from 'console';

class Query {
     //render the department list for adding a role
     async renderDepartments() {
        const departments = await this.getDepartments();
        const choices = departments.map((dept: {department: string})=> dept.department);
        return choices;
    }
     //render the Roles list for adding a role
     async renderRoles() {
        const roles = await this.getRoles();
        const choices = roles.map((roles: {title: string, department:string, salary:Number})=> roles.title);
        return choices;
    }
    //Render the manager choices
    async renderEmployees() {
        const employees = await this.getEmployees();
        const choices = employees.map((employees: {id:Number, first_name:string, last_name:string, title:string,salary:Number, department:string, manager:string})=>  employees.first_name + ' ' + employees.last_name);
        choices.push('None');
        return choices;
    }

    getDepartments = async () => {
        const res = await db.query('SELECT * FROM departments');
        return res.rows;
    };
    getRoles = async () => {
        const res = await db.query(`SELECT roles.id, roles.title, departments.department, roles.salary
            FROM roles
            JOIN departments ON departments.id = roles.department;`
        );
        return res.rows;

    };
    getEmployees = async () => {
        const res = await db.query(`SELECT
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
    LEFT JOIN employees m ON e.manager_id = m.id;`);
        return res.rows;
    }

    async addDepartment(name:string)  {
        // Get all of the current departments
        const currentDept = await db.query('SELECT departments.department FROM departments')
        const check = currentDept.rows.filter((dept)=>dept.department === name)
        //check if the department already exists
        if(!check[0]){
            //If the department does NOT exits insert the department into the db
            await db.query(`INSERT INTO departments (department) VALUES ($1)`,
                [name]
            );
            return console.log(`Added ${name} to the database`)
        } else {
            //If the department does already exist notify the user and return
            return console.log('This department already exists')
        }
    };
   
    async addRole(response:any)  {
        const currentRoles = await db.query('SELECT roles.title FROM roles')
        const check = currentRoles.rows.filter((role)=>role.title === response.role)
        if(!check[0]){
            //get a list of the departments
            const deptid = await this.getDepartments()
            deptid.filter((id)=> {
                if(id.department === response.department) {
                    db.query(`INSERT INTO roles (title, salary, department) VALUES ($1, $2 , $3)`,
                        [response.role,response.salary,id.id]
                    );
                    return console.log(`Added ${response.role} to the database`)
                }
            });   
        } else {
            return console.log('This role already exists')
        }
    };
    async addEmployee(response:any) {
        const currentEmployees = await db.query('SELECT * FROM employees')
        //Check if the employee already exist in the database
        const check = currentEmployees.rows.filter((employee)=>employee.first_name === response.firstname && employee.last_name === response.lastname)
        if(!check[0]){
            //get a list of the employees
            const employees = await this.getEmployees()
            //get a list of the roles
            const roles = await this.getRoles()
            //get the manager id
            const findManager = employees.find((id)=> id.first_name+' '+id.last_name === response.manager)?.employee_id || null;
            console.log(findManager)
            //get the role id
            const roleid = roles.find((id)=>id.title === response.role)?.id || null;
            db.query(`INSERT INTO employees (first_name, last_name, role, manager_id) VALUES ( $1, $2, $3, $4)`,
                [response.firstname, response.lastname, roleid, findManager],
                (err: Error) => {if(err){console.log(err)}}
            );
            return console.log(`Added ${response.first_name+' '+response.last_name} to the database`);   
        } else {
            return console.log('This employee already exists')
        }
    };
    async updateEmployee(response:any) {
        const currentEmployees = await this.getEmployees();
        const roles = await this.getRoles();
        const id = currentEmployees.find((id)=>id.first_name+' '+id.last_name === response.employee)?.employee_id || console.log(error);
        const roleid = roles.find((id)=>id.title===response.role)?.id || console.log(error);
        try {
            db.query(`UPDATE employees SET role = $1 WHERE id = $2`,
                [roleid,id]
            );
        } catch (err) {
            return console.log('Error updating the role for this employee', err)
        }
        return console.log(`${response.employee}'s role has been updated to ${response.role}`)
    };
    updateManager = async () => {

    };
    employeeByManager = async () => {

    };
    employeeByDepartment = async () => {

    };
    departmentBudget = async () => {

    };
    delete = async () => {

    };

};

export default new Query();


