INSERT INTO department (name)
VALUES ('Management')
    ('Sales'),
    ('HR'),
    ('Engineering'),
    ('Legal');


INSERT INTO roles (title, salary, department_id)
VALUES ('Lead Manager', 80000.00, 1)
    ('Sales Associate', 50000.00, 2),
    ('HR Head', 60000.00, 3),
    ('Senior Engineer', 120000.00, 4),
    ('Junior Engineer', 80000.00, 4),
    ('Database Engineer', 87000.00, 4),
    ('Legal Team Lead', 90000.00, 5),
    ('Lawyer', 80000.00, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Brandon", "Maggiano", 4, 2),
       ("Dustin", "Moore", 1, 0),
       ("Rachel", "Thiim", 4, 2),
       ("Amber", "Maggiano", 3, 2),
       ("Kevin", "Finkmister", 5, 1),
       ("Ana", "Bertoli", 2, 2),
       ("Ravish", "Lavish", 6, 0);
       ("Larry", "DaCableGuy", 7, 2);
       ("Mew", "Two", 8, 0);
       ("Skylar", "Gravy", 8, 0);