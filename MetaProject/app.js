//packages
const dotenv = require("dotenv");
const express = require("express");
var morgan = require("morgan");
const sequelize = require("./db/db_connection");
const bodyParser = require("body-parser");
const cors = require("./Middlewares/cors");



//code start route declarations
const routeCreateProject=require("./routes/InitProject");
//code end route declarations

dotenv.config();

const app = express();

//////Middlewares

//Cors
cors.cors(app);

//body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Logging requests to the logs
app.use(morgan());



//code start route statements
app.use("/createProject",routeCreateProject);
//code end route statements


//code start error handling
app.use((req, res, next) => {
  const error = new Error("Route not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: error.message || "Internal error"
  });
});

//code end error handling

//code start server port config 
app.listen(process.env.EXPRESS_PORT, () => {
  console.log(
    "Express server has been started on port " + process.env.EXPRESS_PORT
  );
});
//code end server port config 

//code start db server port config statement
sequelize.connect();
//code end db server port config statement