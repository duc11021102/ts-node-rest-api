import express from "express";

import {
  getAllUsers,
  deleteUser,
  updateUser,
  getDetailUser,
} from "../controllers/users";
import { isAuthenticated, isAdmin, isAdminOrOwner } from "../middlewares";

export default (router: express.Router) => {
  router.get("/users", isAuthenticated, isAdmin, getAllUsers);
  router.get("/user/:id", isAuthenticated, isAdminOrOwner, getDetailUser);
  router.delete("/users/:id", isAuthenticated, isAdminOrOwner, deleteUser);
  router.patch("/users/:id", isAuthenticated, isAdminOrOwner, updateUser);
};
