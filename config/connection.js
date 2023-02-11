// Import the dotenv library for environment variables
require('dotenv').config();

// Import the Sequelize library
const Sequelize = require('sequelize');

const sequelize = process.env.JAWSDB_URL
? new Sequelize(process.env.JAWSDB_URL)
: new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
host: 'localhost',
dialect: 'mysql',
dialectOptions: {
decimalNumbers: true,
},
});

// Export sequelize connection
module.exports = sequelize;