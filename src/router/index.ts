import express from "express";

import authentication from "./authentication";
import adminAuthentication from "./admin.authentication";
import users from "./users";
import roles from "./roles";

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  adminAuthentication(router);
  users(router);
  roles(router);
  return router;
};
