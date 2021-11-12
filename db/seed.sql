use company_db;

insert into departments (dept_name) values ("HR"),("Engineering"),("Purchase"),("Sells"),("Plant Operations");

 insert into role(title,salary,department_id) values 
  (" Engineer",80000.00,2),
  ("Cheif Engineer",95000.00,2),
 ("HR Manager",80000.00,1),
 ("Eng Manager",120000.00,2),
 ("Sales Manager",100000.00,4);
 
 insert into employee (first_name,last_name,role_id)values("Bob","Gomez",3);
insert into employee (first_name,last_name,role_id,manager_id)values("Teddy","Neon",2,5)