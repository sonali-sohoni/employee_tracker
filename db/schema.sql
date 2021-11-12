use company_db;

drop table if exists department;
create table department(
id integer primary key auto_increment,
dept_name varchar(30) not null
);

use company_db;
create table role (
id integer primary key auto_increment,
title varchar(30) not null,
salary decimal(8,2) not null default 0,
department_id integer,
constraint fdeptid foreign key (department_id) references department(id) on delete set null
);

use company_db;
create table employee (
id integer primary key auto_increment,
first_name varchar(30) not null,
last_name varchar(30) not null,
role_id integer,
manager_id integer null 
);