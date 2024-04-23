import express from "express";

import authentication from "./authentication";
import adminAuthentication from "./admin.authentication";
import users from "./users";
import roles from "./roles";
import items from "./item";
import brands from "./brands";

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  adminAuthentication(router);
  users(router);
  roles(router);
  items(router);
  brands(router);
  return router;
};
