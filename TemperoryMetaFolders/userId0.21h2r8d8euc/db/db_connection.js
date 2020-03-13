const dotenv = require("dotenv");
const Sequelize = require("sequelize");

dotenv.config();

// Option 1: Passing parameters separately
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false
  }
 
);

module.exports.connect = function() {
  sequelize
    .authenticate()
    .then(() => {
      console.log(
        "Connection to the database has been established successfully."
      );
    })
    .catch(err => {
      console.error("Unable to connect to the database:", err);
    });
};

module.exports.sequelize = sequelize;
