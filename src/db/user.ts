import mongoose from "mongoose";

// USER CONFIG SCHEMA : MODEL
// SELECT: FALSE MEANS THIS FIELD IS NOT RETURNED WHEN QUERYING THE DATABASE
// SELECT: FALSE NGHĨA LÀ TRƯỜNG NÀY KHÔNG ĐƯỢC TRẢ LẠI KHI TRUY VẤN CƠ SỞ DỮ LIỆU
// AUTHENTICATION CONTAINS INFORMATION ABOUT USER AUTHENTICATION
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  username: { type: String, required: true },
  role: { type: Number, require: true },
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false },
    sessionToken: { type: String, select: false },
  },
});
// EXPORT A USERSCHEMA USERMODEL FOR USE IN OTHER MODULES
export const UserModel = mongoose.model("User", UserSchema);

// USER ACTIONS
// RECORD<STRING, ANY> IS A DATA TYPE DESCRIBING AN OBJECT WHOSE PROPERTIES ARE STRINGS AND ATTRIBUTE VALUES CAN BE ANY DATA TYPE
// CREATEUSER CREATES A NEW USER IN THE DATABASE AND RETURN A PROMISE.
// WHEN THE USER IS SUCCESSFULLY CREATED,
// PROMISE WILL RETURN A NEW JAVASCRIPT OBJECT REPRESENTING THE CREATED USER.
export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({ "authentication.sessionToken": sessionToken });
export const getUserById = (id: string) => UserModel.findById(id);
export const createUser = (values: Record<string, any>) =>
  new UserModel(values).save().then((user) => user.toObject());
export const deleteUserById = (id: string) =>
  UserModel.findOneAndDelete({ _id: id });
export const updateUserById = (id: string, values: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, values);
