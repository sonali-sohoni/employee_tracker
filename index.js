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
			//	getQueryResults("select * from department");

			getQueryResults(opt_select, "select * from department").then(
				(results) => {
					console.table("my returned results");
					console.table(results);
				}
			);
		} else if (opt_select === "View All Roles") {
			const sq = `SELECT role.id,role.title as job_title,role.salary,department.dept_name FROM company_db.role left join department on role.department_id = department.id`;
			printResults(opt_select, sq);
		} else if (opt_select === "View All Employees") {
			const sq = `select e.id,e.first_name,e.last_name ,r.title,d.dept_name,r.salary, concat(m.first_name, m.last_name) as manager from
employee e  left join role r on e.role_id = r.id
left join department d on r.department_id = d.id
left join employee m on e.manager_id = m.id`;
			printResults(opt_select, sq);
		} else if (opt_select === "Add A Department") {
			addNewDepartment();
		} else if (opt_select === "Add A Role") {
			addNewRole();
		}
	});

// const getQueryResults = function (opt_select, sql) {
// 	let results;

// 	db.promise()
// 		.query(sql)
// 		.then(([rows, fields]) => {
// 			console.log(rows);
// 			results = rows;
// 		})
// 		.catch(console.log)
// 		.then(() => db.end());
// 	// .catch(console.log)
// 	// .then(() => db.end());

// 	return results;
// };

const getQueryResults = (opt_select, sql) => {
	return db
		.promise()
		.query(sql)
		.then(([results, fields]) => {
			return results;
		});
};

const printResults = (opt_select, sql) => {
	return db
		.promise()
		.query(sql)
		.then(([results, fields]) => {
			return results;
		});
};

const addNewDepartment = function () {
	inquirer
		.prompt([
			{
				type: "input",
				name: "department",
				message: "Please enter the name of the department you want to add -",
				validate: (arg) => {
					if (!arg) {
						return false;
					} else return true;
				},
			},
		])
		.then((data) => {
			const sql = "insert into department (dept_name) values (?)";
			const params = [data.department];
			db.promise()
				.query(sql, params)
				.then(([rows, fields]) => {
					if (!rows.affectedRows) {
						console.log("Can not add new department");
						return;
					} else {
						console.log("successfully inserted new department.");
						printResults("View All Departments", "select * from department");
					}
				})
				.catch(console.log)
				.then(() => db.end());
		});
};

const addNewRole = function () {
	inquirer
		.prompt([
			{
				type: "input",
				name: "role",
				message: "Please enter the name of the role you want to add -",
				validate: (arg) => {
					if (!arg) {
						return false;
					} else return true;
				},
			},
			{
				type: "input",
				name: "salary",
				message: "Please enter the name of the salary for this role -",
				validate: (arg) => {
					if (!arg) {
						return false;
					} else return true;
				},
			},
			{
				type: "list",
				name: "dept",
				message:
					"Please enter the name of the departmet this role falls under -",
				validate: (arg) => {
					if (!arg) {
						return false;
					} else return true;
				},
				choices: [
					"1-HR",
					"2-Engineering",
					"3-Purchase",
					"4-Sales",
					"5-Plant Operations",
					"6-Admin Operations",
				],
			},
		]) // insert into role(title,salary,department_id) values

		.then((data) => {
			const sql = "insert into department (dept_name) values (?)";
			const params = [data.department];
			db.promise()
				.query(sql, params)
				.then(([rows, fields]) => {
					if (!rows.affectedRows) {
						console.log("Can not add new department");
						return;
					} else {
						console.log("successfully inserted new department.");
						printResults("View All Departments", "select * from department");
					}
				})
				.catch(console.log)
				.then(() => db.end());
		});
};
