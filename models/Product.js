// Import necessary parts of sequelize library
const { Model, DataTypes } = require('sequelize');
// Import the database connection from config.js
const sequelize = require('../config/connection');

// Define the Product model
class Product extends Model {}

// Initialize the model's fields
Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isDecimal: true,
      },
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
      validate: {
        isNumeric: true,
      },
    },
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'category',
        key: 'id',
      },
    },
  },
  {
    sequelize, // Pass the database connection to the model
    timestamps: false, // Don't add timestamps to the model
    freezeTableName: true, // Don't pluralize the model name when creating the table in the database
    underscored: true, // Use underscores instead of camel casing for the field names in the table
    modelName: 'product', // Set the name of the model  
  }
);

// Export
module.exports = Product;