import express from "express";

import {
  getAllItems,
  getItemById,
  createItem,
  getItemByItemName,
  updateItemById,
} from "../db/item.schema";

export const getAllItemsController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const items = await getAllItems();
    return res.status(200).json({
      is_success: true,
      data: items,
      total: items.length,
    });
  } catch (error) {
    return res.status(400).json({
      is_error: true,
      error: {
        code: 400,
        message: "Cannot get all items",
      },
    });
  }
};

export const getDetailItemByIdController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const { id } = req.params;
    const item = await getItemById(id);
    return res.status(200).json({
      is_success: true,
      data: item,
    });
  } catch (error) {
    return res.status(400).json({
      is_error: true,
      error: {
        code: 400,
        message: "Cannot get item",
      },
    });
  }
};

export const createItemController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const data = req.body;

    const existingItem = await getItemByItemName(data.itemName);

    if (existingItem) {
      return res.status(400).json({
        is_error: true,
        error: {
          code: 400,
          message: "Item already exists",
        },
      });
    }
    const date = new Date();
    const created_At = date.toISOString();
    const updated_At = date.toISOString();
    const item = await createItem({ ...data, created_At, updated_At });
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

export const updateItemByIdController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const item = await getItemById(id);
    if (!item) {
      return res.status(400).json({
        is_error: true,
        error: {
          code: 400,
          message: "Cannot find item",
        },
      });
    }
    const updatedItem = await updateItemById(id, data);
    return res
      .status(200)
      .json({
        is_success: true,
        item: updatedItem,
      })
      .end();
  } catch (error) {
    return res.status(400).json({
      is_error: true,
      error: {
        code: 400,
        message: "Cannot update item",
      },
    });
  }
};
