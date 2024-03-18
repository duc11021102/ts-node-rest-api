import express from "express";

import { registerAdmin } from "../controllers/admin.authentication";
import { isAuthenticated , isAdmin} from "../middlewares";
export default (router: express.Router) => {
  router.post("/admin/auth/register",isAuthenticated,isAdmin, registerAdmin);
};
