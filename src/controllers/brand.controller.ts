import express from "express";

import {
  getBrands,
  createBrand,
  getBrandByBrandCode,
} from "../db/brand.schema";

export const getAllBrandsController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const brands = await getBrands();
    return res.status(200).json({
      is_success: true,
      data: brands,
      total: brands.length,
    });
  } catch (error) {
    return res.status(400).json({
      is_error: true,
      error: {
        code: 400,
        message: "Cannot get all brands",
      },
    });
  }
};

export const createBrandController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const data = req.body;

    const existingBrand = await getBrandByBrandCode(data.brandCode);
    if (existingBrand) {
      return res.status(400).json({
        is_error: true,
        error: {
          code: 400,
          message: "Brand already exists",
        },
      });
    }
    const date = new Date();
    const created_At = date.toISOString();
    const updated_At = date.toISOString();

    const item = await createBrand({ ...data, created_At, updated_At });
    return res
      .status(200)
      .json({
        is_success: true,
        data: item,
      })
      .end();
  } catch (error) {
    return res.status(400).json({
      is_error: true,
      error: {
        code: 400,
        message: "Error",
      },
    });
  }
};

export const getBrandByBrandCodeController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { brandCode } = req.body;
    const brand = await getBrandByBrandCode(brandCode);
    return res.status(200).json({
      is_success: true,
      data: brand,
    });
  } catch (error) {
    return res.status(400).json({
      is_error: true,
      error: {
        code: 400,
        message: "Cannot get brand",
      },
    });
  }
};
