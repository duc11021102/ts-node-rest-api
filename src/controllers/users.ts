import express from "express";

import {
  deleteUserById,
  getUsers,
  getUserById,
  getUserBySessionToken,
} from "../db/user";

// GET ALL USERS
export const getAllUsers = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const users = await getUsers();
    console.log(users);
    return res.status(200).json({
      is_success: true,
      data: users,
      total: users.length,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      is_error: true,
      error: {
        code: 400,
        message: "Cannot get all users",
      },
    });
  }
};

//GET DETAIL USER BY ID
export const getDetailUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    return res.status(200).json({
      is_success: true,
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      is_error: true,
      error: {
        code: 400,
        message: "Cannot get user",
      },
    });
  }
};

//GET DETAIL USER BY TOKEN
export const getDetailUserBySessionToken = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const { sessionToken } = req.body;
    if (!sessionToken) {
      return res.status(400).json({
        is_error: true,
        error: {
          code: 400,
          message: "Cannot found session token",
        },
      });
    }
    const user = await getUserBySessionToken(sessionToken);
    if (!user) {
      return res.status(400).json({
        is_error: true,
        error: {
          code: 400,
          message: "Cannot found user",
        },
      });
    }
    return res.status(200).json({
      is_success: true,
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      is_error: true,
      error: {
        code: 400,
        message: "Cannot get user",
      },
    });
  }
};

//DELETE USER
export const deleteUser = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params;

    const deletedUser = await deleteUserById(id);
    return res.json(deletedUser);
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      is_error: true,
      error: {
        code: 400,
        message: "Cannot delete users",
      },
    });
  }
};

//UPDATE USER
export const updateUser = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params;
    const { username, email } = req.body;

    if (!username || !email) {
      return res.sendStatus(400).json({
        is_error: true,
        error: {
          code: 400,
          message: "Not found value data",
        },
      });
    }

    const user = await getUserById(id);

    user.username = username;
    user.email = email;
    await user.save();
    return res
      .status(200)
      .json({
        is_success: true,
        data: user,
      })
      .end();
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      is_error: true,
      error: {
        code: 400,
        message: "Cannot update user",
      },
    });
  }
};
