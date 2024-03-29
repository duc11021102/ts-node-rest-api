// CREATE REGISTER CONTROLLER FOR ADMIN
import express from "express";
import { getUserByEmail, createUser } from "../db/user";
import {
  authentication,
  random,
  getValidDomain,
  clientHostName,
} from "../helpers";
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
        is_error: true,
        error: {
          code: 400,
          message: "Not found emai, password or username",
        },
      });
    }

    // GET CLIENT DOMAIN FROM REQ
    // const clientHost = clientHostName(req);
    // // CHECK IF THE DOMAIN IS INVALID
    // const validDomain = getValidDomain(clientHost);
    // if (validDomain === "") {
    //   return res.status(400).json({
    //     error: {
    //       is_error: true,
    //       code: 400,
    //       message: "Invalid hostname!!!",
    //     },
    //   });
    // }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        is_error: true,
        error: {
          code: 400,
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
        is_success: true,
        data: user,
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
