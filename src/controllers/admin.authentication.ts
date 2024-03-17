// CREATE REGISTER CONTROLLER FOR ADMIN
import express from "express";
import { getUserByEmail, createUser } from "../db/user";
import { authentication, random } from "../helpers";
import { RoleId } from "db/role";
//REGISTER
export const registerAdmin = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res.status(400).json({
        error: {
          status: "400",
          message: "Not found email or password",
        },
      });
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        error: {
          status: "400",
          message: "Email already exists",
        },
      });
    }
    // EACH USER WILL HAVE A OWN SALT CODE
    const salt = random();
    const role = RoleId.ADMIN;
    const user = await createUser({
      email,
      username,
      role,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res
      .status(200)
      .json({
        data: user,
      })
      .end();
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: {
        status: "400",
        message: "Error",
      },
    });
  }
};
