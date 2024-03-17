import mongoose from "mongoose";

export const enum RoleCode {
  ADMIN = "admin",
  USER = "user",
}

export const enum RoleId {
  ADMIN = 1,
  USER = 2,
}

export interface IRole {
  codeDtl: String;
  codeId: Number;
  createAt: Date;
}
// export interface IRoleResult {
//   _id: Object;
//   codeDtl: String;
//   codeId: Number;
//   createAt: Date;
// }

const RoleSchema = new mongoose.Schema({
  codeDtl: {
    type: String,
    enum: [RoleCode.ADMIN, RoleCode.USER],
    require: true,
  },
  codeId: {
    type: Number,
    enum: [RoleId.ADMIN, RoleId.USER],
  },
  createAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

export const RoleModel = mongoose.model("Role", RoleSchema);

export const getRoles = () => RoleModel.find();
export const getRoleByCodeDtl = (codeDtl: String) =>
  RoleModel.findOne({ codeDtl });
export const createRole = (values: IRole) =>
  new RoleModel(values).save().then((role) => role.toObject());
