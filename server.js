import db  from'./db/connections.js'; 
import inquirer  from'inquirer'; 
import cTable from'console.table';

db.connect(err =>{
    if(err) throw err; 
    init()
})

let init = function() {
    inquirer.prompt([
        {
            name: "operation",
            type: "list",
            message: "What do you want to do?",
            choices: [
                "View departments",
                "View roles",
                "View employees",
                "Add a new department",
                "Add a new role",
                "Add a new employee",
                "Update an employee role",
                "exit"
            ]
        }])
        .then(function (answer) {
            switch (answer.operation) {
                case "View departments":
                    viewDepartments();
                    break;
                case "View roles":
                    viewRoles();
                    break;
                case "View employees":
                    viewEmployees();
                    break;
                case "Add a new department":
                    addDepartment();
                    break;
                case "Add a new role":
                    addRole();
                    break;
                case "Add a new employee":
                    addEmployee();
                    break;
                case "Update employee roles":
                    updateRole();
                    break;
                case "exit":
                    process.exit();
                    break;
            }
        });
}; 




function viewDepartments() {
    db.query('SELECT * FROM department', (err, res)=>{
        if(err) throw err; 
        console.table(res);
        init(); 
    })
};

function viewRoles() {
    db.query(`SELECT roles.id AS RoleId, roles.title AS Title, roles.salary AS Salary, department.name AS Department
      FROM roles
      LEFT JOIN department ON roles.department_id = department.id`, (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    })
};

function viewEmployees() {
    db.query(`SELECT employee.id AS Id, employee.first_name AS First_Name, employee.last_name AS Last_Name, roles.title AS Title, department.name AS Department, roles.salary AS Salary, manager.first_name AS Manager
    FROM employee employee
    LEFT JOIN roles ON employee.role_id = roles.id
    LEFT JOIN department ON roles.department_id = department.id
    LEFT JOIN employee manager ON manager.id = employee.manager_id`, (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    })
}; 

function addDepartment() {
    db.query("SELECT * FROM department", (err, res) =>{
        if (err) throw err; 
        inquirer.prompt([
            {
                type: 'input',
                name: 'nameDepartment',
                message: 'What is the name of the new department?'
            },
        ])
        .then(data =>{
            db.query(`INSERT INTO department SET ?`,{
                name: data.nameDepartment
            })
            init(); 
        })
    })
};

function addRole() {
    db.query('SELECT * FROM department', (err, res) =>{
        if(err) throw err; 
        inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What is the title of the new role?'
            },
            {
                type: 'number',
                name: "salary",
                message: "Please enter the yearly salary for this role using numbers"
            },
            {
                type: "list",
                name: 'department_name',
                message: 'what is the department of the new role?', 
                choices: res.map(department => department.name)
            },
        ])
        .then(data =>{
            let departmentName = res.find(department => department.name === data.department_name)
            db.query('INSERT INTO roles SET ?',{
                title: data.title, 
                salary: data.salary,
                department_id: departmentName.id,
            })
            init(); 
        })
    })
}; 

function addEmployee() {
    db.query("SELECT * FROM roles", (err, res) =>{
        if(err) throw err; 
        inquirer.prompt([
            {
                type: 'input',
                name: 'first_name',
                message: 'What is the new employees first name?'
            },
            {
                type: 'input', 
                name: 'last_name',
                message: 'What is the new employees last name?'
            },
            {
                type: 'list',
                name: 'role_title',
                message: 'What is the role for the new employee?',
                choices: res.map(role =>role.title)
            },

        ])
        .then(data =>{
            let roleTitle = res.find(role=>role.title === data.role_title)
            db.query('INSERT INTO employee SET ?', {
                first_name: data.first_name,
                last_name: data.last_name, 
                role_id: roleTitle.id,
            })
            init(); 
        }) 
    })
};

function updateRole() {
    db.query('SELECT id, first_name FROM employee', (err, res) => {
    if (err) throw err;
        employees = res.map(employee => employee.first_name);
    inquirer.prompt([
        
        {
            
            type: "list",
            name: 'employee_name',
            message: 'Which employee are you updating?',
            choices: employees,
            
        },
        {
            type: 'list',
            name: 'new_role',
            message: 'What is the new role for this employee?',
            choices: res.map(role => role.title),
        }
    ])
        .then(data => {
            let roleTitle = res.find(role => role.title === data.new_role)
            db.query(`UPDATE employee SET role_id = ${roleTitle.id}  WHERE id =${employee_name.id} `)
            init();
        })
})
}; 