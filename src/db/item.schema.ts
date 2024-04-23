import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  itemPrice: { type: Number, required: true },
  categoryCode: { type: Number, required: true },
  subCategoryCode: { type: Number, required: true },
  brandCode: { type: Number, required: true },
  discountType: { type: Number, required: true },
  inventoryCode: { type: Number, required: true },
  itemName: { type: String, required: true },
  itemSKU: { type: String, required: true },
  itemImage: { type: String, required: true },
  description: { type: String, required: true },
  created_At: { type: String, required: true },
  updated_At: { type: String, required: true },
});

export const ItemModel = mongoose.model("Item", ItemSchema);

export const getAllItems = () => ItemModel.find();
export const getItemById = (id: string) => ItemModel.findById({ _id: id });
export const getItemsByCategoryCode = (categoryCode: number) =>
  ItemModel.find({ categoryCode });
export const getItemsByBrandCode = (brandCode: number) =>
  ItemModel.find({ brandCode });
export const getItemByItemName = (itemName: string) =>
  ItemModel.findOne({ itemName });
export const createItem = (values) =>
  new ItemModel(values).save().then((item) => item.toObject());
export const updateItemById = (id: string, values) =>
  ItemModel.findByIdAndUpdate({ _id: id }, values);
