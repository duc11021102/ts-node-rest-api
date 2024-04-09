import express from "express";

import {
  getAllUsers,
  deleteUser,
  updateUser,
  getDetailUser,
  getDetailUserBySessionToken,
} from "../controllers/users";
import {
  isAuthenticated,
  isAdmin,
  isAdminOrOwner,
  authenToken,
} from "../middlewares";

export default (router: express.Router) => {
  router.get("/users", isAuthenticated, isAdmin, authenToken, getAllUsers);
  router.get("/user/:id", isAuthenticated, isAdminOrOwner, getDetailUser);
  router.delete(
    "/users/:id",
    isAuthenticated,
    isAdminOrOwner,
    authenToken,
    deleteUser,
  );
  router.patch(
    "/users/:id",
    isAuthenticated,
    isAdminOrOwner,
    authenToken,
    updateUser,
  );
  router.get("/user", isAuthenticated, isAdmin, getDetailUserBySessionToken);
};
