USE business; 

INSERT INTO department (name)
VALUES ('IT'), ('Sales'), ('HR'), ('Dev'); 

INSERT INTO roles (title, salary, department_id)
VALUES ('VP', 100, 1), ('Janitor', 200, 2), ('greeter', 25, 3), ('boss', 500, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Robert', 'Kurle',4, null), ('spencer', 'clark', 2, 1), ('abby', 'clark', 1,1), ('Abe', 'clark', 3,3); 