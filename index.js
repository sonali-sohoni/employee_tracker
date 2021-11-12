const db = require("./db/connection");
const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");
const { error } = require("console");

//Display menu with inquirer
console.log("Welcome to Employee Tracker System!!");
inquirer
	.prompt([
		{
			type: "list",
			name: "options",
			message: "Please select one of the options - ",
			choices: [
				"View All Departments",
				"View All Roles",
				"View All Employees",
				"Add A Department",
				"Add A Role",
				"Add A Employee",
				"Update Employee Role",
			],
		},
	])
	.then((res) => {
		const opt_select = res.options;
		if (opt_select === "View All Departments") {
			printResults(opt_select, "select * from department");
		} else if (opt_select === "View All Roles") {
			const sq = `SELECT role.id,role.title as job_title,role.salary,department.dept_name FROM company_db.role left join department on role.department_id = department.id`;
			printResults(opt_select, sq);
		} else if (opt_select === "View All Employees") {
			const sq = `select e.id,e.first_name,e.last_name ,r.title,d.dept_name,r.salary, concat(m.first_name, m.last_name) as manager from
employee e  left join role r on e.role_id = r.id
left join department d on r.department_id = d.id
left join employee m on e.manager_id = m.id`;
			printResults(opt_select, sq);
		}
	});

const printResults = function (opt_select, sql) {
	db.promise()
		.query(sql)
		.then(([rows, fields]) => {
			console.table(opt_select + "\n");
			console.table(rows);
		})
		.catch(console.log)
		.then(() => db.end());
};

// db.query("SELECT * FROM departments", function (err, results) {
// 	console.log(results);
// 	console.log(err);
// });
