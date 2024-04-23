// MIDDLEWARE
// BODYPARSER WILL CONVERT THE DATA RECEIVED FROM THE HTTP REQUEST INTO A JAVASCRIPT OBJECT USED FOR PROCESSING IN THE APPLICATION
// COOKIEPARSER IS A MIDDLEWARE USED TO ANALYZE AND CREATE COOKIES IN HTTP REQUESTS.
// COMPRESSION IS A MIDDLEWARE USED TO COMPRESS DATA BEFORE SENDING IT FROM THE SERVER TO THE CLIENT (CLIENT)
// MIDDLEWARE CORS IS USED TO ENABLE CORS IN EXPRESS APPLICATIONS, ALLOWING REQUESTS FROM DIFFERENT ORIGINS TO BE ACCEPTED
// MONGOOSE PROVIDES BASIC OPERATIONS SUCH AS SEARCH, ADD, UPDATE AND DELETE DOCUMENTS FROM MONGODB DATABASE.
// MORGAN MIDDLEWARE FOR LOGGER METHOD
// SWAGGER FOR DOCUMENT API
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import http from "http";
import mongoose from "mongoose";
import router from "./router";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import YAML from "yaml";
import fs from "fs";
import path from "path";
import morgan from "morgan";
import options from "./utils/config.swagger";
require("dotenv").config();
// var morgan = require("morgan");
//APP
const app = express();
//CONVERT YAML FILE
const file = fs.readFileSync(path.resolve("swagger.yaml"), "utf8");
const swaggerDocument = YAML.parse(file);
//SERVER
const server = http.createServer(app);
//SWAGGER JS DOC
const openapiSpecification = swaggerJSDoc(options);

// CONNECT MONGODB
if (process.env.MONGO_URL && process.env.MONGO_PASSWORD) {
  const db = process.env.MONGO_URL.replace(
    "<password>",
    process.env.MONGO_PASSWORD,
  );
  mongoose.Promise = Promise;
  mongoose.connect(db);
  mongoose.connection.on("error", (error: Error) => console.log(error));
}
// CONNECT SERVER
if (process.env.PORT) {
  server.listen(process.env.PORT, () => {
    console.log(`SERVER IS RUNNING ON PORT ${process.env.PORT}`);
  });
}

// app.use(
//   "/api-docs/swagger-ui",
//   swaggerUi.serve,
//   swaggerUi.setup(swaggerDocument),
// );
app.use(
  "/api-docs/swagger-ui",
  swaggerUi.serve,
  swaggerUi.setup(openapiSpecification),
);
app.use(
  cors({
    credentials: true,
  }),
);
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use("/", router());
app.use(
  morgan(
    ":remote-addr :method :url :status :res[content-length] - :response-time ms [:date[clf]]",
  ),
);

export default app;
