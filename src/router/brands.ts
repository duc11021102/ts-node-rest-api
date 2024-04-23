import express from "express";
import {
  getAllBrandsController,
  createBrandController,
  getBrandByBrandCodeController,
} from "../controllers/brand.controller";
export default (router: express.Router) => {
  router.get("/brands", getAllBrandsController);
  router.post("/brands", createBrandController);
  router.get("/brand", getBrandByBrandCodeController);
};
