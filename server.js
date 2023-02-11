// Import the express library
const express = require('express');
// Import the database connection
const sequelize = require('./config/connection');
// Import the routes
const routes = require('./routes');


const app = express();
// Define the port the application will run on
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the imported routes in our application
app.use(routes);

// Sync the models with the database and start the express server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
});