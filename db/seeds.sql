INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
('Rob', 'Smith', 1, 2),
('Jason', 'Woolf', 2, 2),
('Chole', 'Gaveston',2, 3),
('Charles', 'LeRoi', 1,5),
('Kat', 'Mansfield', 1,3);

INSERT INTO roles (title, salary, department_id)
VALUES
('Sales Lead', 110000, 1),
('Salesperson', 75000, 1),
('Engineer Lead', 165000, 2),
('Software Engineer', 140000, 2),
('Legal Team Lead', 290000, 3),
('Lawyer', 220000, 3)
;