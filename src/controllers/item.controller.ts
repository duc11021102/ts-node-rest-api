import express from "express";

import {
  getAllItems,
  getItemById,
  createItem,
  getItemByItemName,
  updateItemById,
  getItemsByCategoryCode,
  getItemByInventoryCode,
  getItemByNameCode,
} from "../db/item.schema";

export const getAllItemsController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    // const { page } = req.query;
    const result = await getAllItems();
    // const startIndex = +page * 16;
    // const items = result.slice(startIndex, startIndex + 16);
    // return res.status(200).json({
    //   is_success: true,
    //   data: items,
    //   total: items.length,
    // });
    return res.status(200).json({
      is_success: true,
      data: result,
      total: result.length,
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

    const existingName = await getItemByItemName(data.itemName);
    const existingInventory = await getItemByInventoryCode(data.inventoryCode);
    if (existingName) {
      return res.status(400).json({
        is_error: true,
        error: {
          code: 400,
          message: "Item name already exists",
        },
      });
    }
    if (existingInventory) {
      return res.status(400).json({
        is_error: true,
        error: {
          code: 400,
          message: "Inventory code already exists",
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
    const date = new Date();
    const updated_At = date.toISOString();

    const updatedItem = await updateItemById(
      id,
      { ...data, updated_At },
      {
        new: true,
      },
    );
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

export const getItemsByCategoryCodeController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { type, page } = req.query;
    const code = +type;
    const result = await getItemsByCategoryCode(code);
    // const allItems = await getAllItems();
    if (!result) {
      return res.status(400).json({
        is_error: true,
        error: {
          code: 400,
          message: "Cannot get items from db",
        },
      });
    }
    const startIndex = +page * 16;
    const items = result.slice(startIndex, startIndex + 16);
    // return res.status(200).json({
    //   is_success: true,
    //   data: items,
    //   total: allItems.length,
    // });
    setTimeout(() => {
      return res.status(200).json({
        is_success: true,
        data: items,
        total: result.length,
      });
    }, 500);
  } catch (error) {
    return res.status(400).json({
      is_error: true,
      error: {
        code: 400,
        message: "Cannot get items",
      },
    });
  }
};
export const getDetailItemByNameCode = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { nameCode } = req.params;
    const item = await getItemByNameCode(nameCode);
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
