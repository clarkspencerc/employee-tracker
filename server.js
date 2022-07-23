import db  from'./db/connections.js'; 
import inquirer  from'inquirer'; 

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
                    connection.end();
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
    db.query('SELECT * FROM roles', (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    })
};

function viewEmployees() {
    db.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    })
} 

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
}

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