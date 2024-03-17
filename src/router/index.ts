import express from "express";

import authentication from "./authentication";
import users from "./users";
import roles from "./roles";

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  users(router);
  roles(router);
  return router;
};
