import mongoose from "mongoose";

export interface ICategory {
  categoryCode: String;
  categoryName: Number;
  created_At: String;
}

const CategorySchema = new mongoose.Schema({
  categoryCode: { type: Number, required: true },
  categoryName: { type: String, required: true },
  createAt: {
    type: String,
    select: false,
  },
});

export const CategoryModel = mongoose.model("Category", CategorySchema);

export const getCategories = () => CategoryModel.find();
export const getCategoryByCategoryCode = (categoryCode: Number) =>
  CategoryModel.findOne({ categoryCode });

export const createCategory = (values: ICategory) =>
  new CategoryModel(values).save().then((category) => category.toObject());
