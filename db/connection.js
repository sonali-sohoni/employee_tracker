const mysql = require("mysql2");

const db = mysql.createConnection(
	{
		host: "localhost",
		user: "root",
		password: "password",
		database: "company_db",
		port: 3310,
	},
	console.log("Database connected successfully")
);

module.exports = db;
