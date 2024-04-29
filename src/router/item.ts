import express from "express";
import {
  getAllItemsController,
  getDetailItemByIdController,
  createItemController,
  updateItemByIdController,
  getItemsByCategoryCodeController,
  getDetailItemByNameCode,
} from "../controllers/item.controller";
export default (router: express.Router) => {
  router.get("/items", getAllItemsController);
  // router.get("/items/:id", getDetailItemByIdController);
  router.get("/items/:name_code", getDetailItemByNameCode);
  router.post("/items", createItemController);
  router.patch("/items/:id", updateItemByIdController);
  router.get("/items_category", getItemsByCategoryCodeController);
};
