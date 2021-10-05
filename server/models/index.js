const path = require('path');
const Sequelize = require('sequelize');
const config = require(path.join(__dirname, '/../config/db.config.json'))[
	'development'
];

const db = {};
const { database, username, password } = config;

try {
	const sequelize = new Sequelize(database, username, password, config);

	const User = require('./user')(sequelize, Sequelize);

	db.sequelize = sequelize;
	db.Sequelize = Sequelize;
	db.User = User;
} catch (err) {
	console.error('Unable to connect to the database:', error);
}

module.exports = db;
