import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
  itemId: { type: String, required: true },
  itemName: { type: String, required: true },
  itemSize: { type: Number, required: true },
  itemAmount: { type: Number, required: true },
  updated_At: { type: String, required: true },
});

export const InventoryModel = mongoose.model("Inventory", InventorySchema);

export const getAllInventories = () => InventoryModel.find();
export const getInventoryById = (id: string) => InventoryModel.findById({ id });
export const getInventoryByItemId = (itemId: string) =>
  InventoryModel.find({ itemId });
