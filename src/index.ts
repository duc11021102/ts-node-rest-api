// MIDDLEWARE
// BODYPARSER WILL CONVERT THE DATA RECEIVED FROM THE HTTP REQUEST INTO A JAVASCRIPT OBJECT USED FOR PROCESSING IN THE APPLICATION
// COOKIEPARSER IS A MIDDLEWARE USED TO ANALYZE AND CREATE COOKIES IN HTTP REQUESTS.
// COMPRESSION IS A MIDDLEWARE USED TO COMPRESS DATA BEFORE SENDING IT FROM THE SERVER TO THE CLIENT (CLIENT)
// MIDDLEWARE CORS IS USED TO ENABLE CORS IN EXPRESS APPLICATIONS, ALLOWING REQUESTS FROM DIFFERENT ORIGINS TO BE ACCEPTED
// MONGOOSE PROVIDES BASIC OPERATIONS SUCH AS SEARCH, ADD, UPDATE AND DELETE DOCUMENTS FROM MONGODB DATABASE.
// MORGAN MIDDLEWARE FOR LOGGER METHOD
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import http from "http";
import mongoose from "mongoose";
import router from "./router";
var morgan = require("morgan");
const app = express();
require("dotenv").config();

app.use(
  cors({
    credentials: true,
  }),
);
const server = http.createServer(app);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  morgan(
    ":remote-addr :method :url :status :res[content-length] - :response-time ms [:date[clf]]",
  ),
);
app.use("/", router());

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

if (process.env.PORT) {
  server.listen(process.env.PORT, () => {
    console.log(`SERVER IS RUNNING ON PORT ${process.env.PORT}`);
  });
}

export default app;
