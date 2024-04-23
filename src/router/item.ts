import express from "express";
import {
  getAllItemsController,
  getDetailItemByIdController,
  createItemController,
  updateItemByIdController,
} from "../controllers/item.controller";
export default (router: express.Router) => {
  router.get("/items", getAllItemsController);
  router.get("/items/:id", getDetailItemByIdController);
  router.post("/items", createItemController);
  router.put("/items/:id", updateItemByIdController);
};
