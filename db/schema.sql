use company_db;

drop table if exists departments;
create table departments(
id integer primary key auto_increment,
dept_name varchar(30) not null
);
