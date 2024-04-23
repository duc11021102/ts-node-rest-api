import mongoose from "mongoose";

// export const enum BrandCode {
//   NIKE = "Nike",
//   ADIDAS = "Adidas",
//   PUMA = "Puma",
//   KAPPA = "Kappa",
// }

// export const enum BrandId {
//   NIKE = 1,
//   ADIDAS = 2,
//   PUMA = 3,
//   KAPPA = 4,
// }

export interface IBrand {
  brandCode: Number;
  brandName: String;
  brandImage: String;
  created_At: String;
  updated_At: String;
}

const BrandSchema = new mongoose.Schema({
  brandCode: { type: Number, required: true },
  brandName: { type: String, required: true },
  brandImage: { type: String, required: true },
  created_At: { type: String },
  updated_At: { type: String },
});

export const BrandModel = mongoose.model("Brand", BrandSchema);

export const getBrands = () => BrandModel.find();
export const getBrandByBrandCode = (brandCode: Number) =>
  BrandModel.findOne({ brandCode });
export const createBrand = (values: IBrand) =>
  new BrandModel(values).save().then((brand) => brand.toObject());
