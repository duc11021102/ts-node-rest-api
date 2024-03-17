import express from "express";
import { createRoles, getAllRoles } from "../controllers/roles";
import { isAuthenticated, isAdmin } from "../middlewares";
export default (router: express.Router) => {
  router.post("/roles", isAuthenticated, isAdmin, createRoles);
  router.get("/roles", isAuthenticated, isAdmin, getAllRoles);
};
