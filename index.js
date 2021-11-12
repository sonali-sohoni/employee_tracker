const db = require("./db/connection");
const mysql = require("mysql2");
console.log("welcome");


//Display menu with inquirer
db.query("SELECT * FROM departments", function (err, results) {
	console.log(results);
	console.log(err);
});
