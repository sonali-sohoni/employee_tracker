const db = require("./db/connection");
const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");
const { error } = require("console");
const { fsyncSync } = require("fs");

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
				"Add An Employee",
				"Update Employee's Role",
			],
		},
	])
	.then((res) => {
		const opt_select = res.options;
		if (opt_select === "View All Departments") {
			//	getQueryResults("select * from department");

			//
			printResults(opt_select, "select * from department");
		} else if (opt_select === "View All Roles") {
			const sq = `SELECT role.id,role.title as job_title,role.salary,department.dept_name FROM company_db.role left join department on role.department_id = department.id`;
			printResults(opt_select, sq);
			//	printResults(opt_select, sq);
		} else if (opt_select === "View All Employees") {
			const sq = `select e.id,e.first_name,e.last_name ,r.title,d.dept_name,r.salary, concat(m.first_name, " ",m.last_name) as manager from
employee e  left join role r on e.role_id = r.id
left join department d on r.department_id = d.id
left join employee m on e.manager_id = m.id`;
			printResults(opt_select, sq);
			// getQueryResults(opt_select, sq).then((results) => {
			// 	console.table("my returned results");
			// 	console.table(results);
			// });
			//	printResults(opt_select, sq);
		} else if (opt_select === "Add A Department") {
			addNewDepartment();
		} else if (opt_select === "Add A Role") {
			addNewRole();
		} else if (opt_select === "Add An Employee") {
			addNewEmployee();
		} else if (opt_select === "Update Employee's Role") {
			updateEmployeeRole();
		}
	});

const getQueryResults = (sql) => {
	return db
		.promise()
		.query(sql)
		.then(([results, fields]) => {
			return results;
		})
		.catch((e) => {
			console.log(e);
		});
};

const printResults = (opt_select, sql) => {
	getQueryResults(sql)
		.then((results) => {
			console.table(
				"-------------------------------------------------------------------------\n"
			);
			console.table(opt_select);
			console.table(
				"\n-------------------------------------------------------------------------\n"
			);
			console.table(results);
		})
		.catch((err) => {
			console.log(err);
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
	let dept_arr = [];
	getQueryResults("select * from department").then((results) => {
		//	console.log(results);

		results.forEach((obj) => {
			dept_arr.push(obj.id + "_" + obj.dept_name);
		});
		//	console.log(dept_arr);
	});
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
				choices: dept_arr,
			},
		]) // insert into role(title,salary,department_id) values

		.then((data) => {
			//(" Engineer",80000.00,2),
			const deptid = data.dept.split("_")[0];
			const sql = "insert into role(title,salary,department_id) values (?,?,?)";
			const params = [data.role, data.salary, deptid];
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

const addNewEmployee = function () {
	let role_arr = [];
	let emp_arr = [];
	console.log(11);
	getQueryResults("select * from role").then((results) => {
		//console.log(results);

		results.forEach((obj) => {
			role_arr.push(obj.id + "_" + obj.title);
		});
		//	console.log(dept_arr);
	});
	getQueryResults("select * from employee").then((results) => {
		//console.log(results);

		results.forEach((obj) => {
			emp_arr.push(obj.id + "_" + obj.first_name + " " + obj.last_name);
		});
		console.log(emp_arr);
	});
	emp_arr.push("none");
	inquirer
		.prompt([
			{
				type: "input",
				name: "fname",
				message: "Please enter the first name of an employee -",
				validate: (arg) => {
					if (!arg) {
						return false;
					} else return true;
				},
			},
			{
				type: "input",
				name: "lname",
				message: "Please enter the last name of an employee -",
				validate: (arg) => {
					if (!arg) {
						return false;
					} else return true;
				},
			},
			{
				type: "list",
				name: "role",
				message: "Please enter the employee's role -",
				validate: (arg) => {
					if (!arg) {
						return false;
					} else return true;
				},
				choices: role_arr,
			},
			{
				type: "list",
				name: "manager",
				message:
					"Please select the employee's manager - select none if employee does not have manager assigned.",
				choices: emp_arr,
			},
		])

		.then((data) => {
			console.log(data);
			// 		//(" Engineer",80000.00,2),
			const roleid = data.role.split("_")[0];
			let managerid = null;
			if (data.manager !== "none") managerid = data.manager.split("_")[0];
			let sql =
				"insert into employee (first_name,last_name,role_id,manager_id)values (?,?,?,?)";
			let params = [data.fname, data.lname, roleid, managerid];
			console.log(!data.manager_id);
			if (!managerid) {
				sql =
					"insert into employee (first_name,last_name,role_id)values (?,?,?)";
				params = [data.fname, data.lname, roleid];
			}
			// const sql =
			// 	"insert into employee (first_name,last_name,role_id,manager_id)values (?,?,?,?)";
			// 	const params = [data.fname, data.lname, roleid];
			console.log(sql, params);
			db.promise()
				.query(sql, params)
				.then(([rows, fields]) => {
					if (!rows.affectedRows) {
						console.log("Can not add new employee");
						return;
					} else {
						console.log("successfully inserted new employee.");
						printResults("View All Departments", "select * from employee");
					}
				})
				.catch(console.log)
				.then(() => db.end());
		});
};
const updateEmployeeRole = function () {
	let role_arr = [];
	let emp_arr = [];
	const questions = [
		{
			type: "list",
			name: "emp",
			message: "Please select the employee from the list -",
			choices: emp_arr,
		},
		{
			type: "list",
			name: "role",
			message: "Please select the employee's new role -",
			validate: (arg) => {
				if (!arg) {
					return false;
				} else return true;
			},
			choices: role_arr,
		},
	];

	getQueryResults("select * from role")
		.then((results) => {
			//console.log(results);

			results.forEach((obj) => {
				role_arr.push(obj.id + "_" + obj.title);
			});
			console.log(0);
			console.log(role_arr);
			return getQueryResults("select * from employee");
		})
		.then((results) => {
			console.log(1);
			console.log(results);

			results.forEach((obj) => {
				emp_arr.push(obj.id + "_" + obj.first_name + " " + obj.last_name);
			});

			return inquirer.prompt(questions);
		})
		.then((data) => {
			console.log(data);
			// 		//(" Engineer",80000.00,2),
			const roleid = data.role.split("_")[0];
			empid = data.emp.split("_")[0];
			let sql = "update employee set role_id = ? where id = ?";
			let params = [roleid, empid];

			console.log(sql, params);
			return db.promise().query(sql, params);
		})
		.then(([rows, fields]) => {
			console.log(rows);
			if (!rows.affectedRows) {
				console.log("Can not add new employee");
				return;
			} else {
				console.log("Selected employee's role has been successfully updated.");
				printResults("View All Employees", "select * from employee");
			}
		})
		.catch((err) => {
			console.log(e);
			db.end();
		});
};
