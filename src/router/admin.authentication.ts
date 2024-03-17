import express from "express";

import { registerAdmin } from "../controllers/admin.authentication";
export default (router: express.Router) => {
  router.post("/admin/auth/register", registerAdmin);
};
