import Query from './queries.js';
import { mainMenuPrompt } from './index.js';
import { db } from './db.js';
import inquirer from 'inquirer';
export const runApp = async () => {
    let exitApp = false;
    while (!exitApp) {
        const { action } = await mainMenuPrompt();
        switch (action) {
            case 'View all departments':
                console.table(await Query.getDepartments());
                break;
            case 'View all roles':
                console.table(await Query.getRoles());
                break;
            case 'View all employees':
                console.table(await Query.getEmployees());
                break;
            case 'Add a department':
                await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'department',
                        message: 'What is the name of the department?',
                        validate: (input) => {
                            if (!input.trim()) {
                                return 'Department name cannon be blank. Please enter a valid response.';
                            }
                            return true;
                        }
                    }
                ]).then((Response) => Query.addDepartment(Response.department));
                break;
            case 'Add a role':
                const departmentChoices = await Query.renderDepartments();
                await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'role',
                        message: 'What is the name of the role?',
                        validate: (input) => {
                            if (!input.trim()) {
                                return 'Role name cannon be blank. Please enter a valid response.';
                            }
                            return true;
                        }
                    },
                    {
                        type: 'input',
                        name: 'salary',
                        message: 'What is the salary of the role?',
                        validate: (input) => {
                            if (!input.trim()) {
                                return 'Salary amount cannon be blank. Please enter a valid response.';
                            }
                            return true;
                        }
                    },
                    {
                        type: 'list',
                        name: 'department',
                        message: 'What department does the role fall under?',
                        choices: departmentChoices
                    }
                ]).then((Response) => Query.addRole(Response));
                break;
            case 'Add an employee':
                const roles = await Query.renderRoles();
                const managers = await Query.renderEmployees();
                await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'firstname',
                        message: 'What is their first name?'
                    },
                    {
                        type: 'input',
                        name: 'lastname',
                        message: 'What is their last name?'
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: 'Select their role.',
                        choices: roles
                    },
                    {
                        type: 'list',
                        name: 'manager',
                        message: 'Select their manager, if they have one.',
                        choices: managers
                    }
                ]).then((Response) => Query.addEmployee(Response));
                break;
            case 'Update an employee role':
                const rolesname = await Query.renderRoles();
                const employees = await Query.renderEmployees();
                await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'employee',
                        message: 'Which employee do you want to update?',
                        choices: employees
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: 'What is their new role?',
                        choices: rolesname
                    }
                ]).then((Response) => Query.updateEmployee(Response));
                break;
            case 'Exit':
                exitApp = true;
                break;
        }
    }
    db.end(); // Close DB connection
};
runApp();
