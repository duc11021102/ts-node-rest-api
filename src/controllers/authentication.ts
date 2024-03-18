import express from "express";

import { getUserByEmail, createUser } from "../db/user";
import { authentication, random } from "../helpers";
import { RoleId } from "db/role";
// LOGIN
export const login = async (req: express.Request, res: express.Response) => {
  try {
    //EXPRESS.REQUEST IS AN OBJECT THAT CONTAINS INFORMATION ABOUT THE HTTP REQUEST
    //EXPRESS.RESPONSE IS AN OBJECT USED TO SEND HTTP RESPONSE TO CLIENT
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: {
          status: "400",
          message: "Not found email or password",
        },
      });
    }
    // RETURN USER WITH ONLY 2 FIELDS authentication.salt AND authentication.password
    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password",
    );

    if (!user) {
      return res.status(400).json({
        error: {
          status: "400",
          message: "Wrong email or password",
        },
      });
    }

    // HASHING USER.AUTHENTICATION.SALT AND PASSWORD RETURN A HASH CODE
    const expectedHash = authentication(user.authentication.salt, password);

    // CHECK IF THE PASSWORD IS CORRECT
    if (user.authentication.password != expectedHash) {
      return res.status(403).json({
        error: {
          status: "400",
          message: "Wrong password",
        },
      });
    }

    // CREATE AND ASSIGN NEW SESSION TOKEN TO USER
    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString(),
    );
    // SAVE UPDATED INFORMATION TO THE DATABASE
    await user.save();
    // THIS COOKIE MAY BE USED TO AUTHENTIZE THE USER IN SUBSEQUENT REQUESTS.
    res.cookie("XAVIA-AUTH", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
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
//LOGOUT
export const logout = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const sessionToken = req.cookies["XAVIA-AUTH"];
    // CHECK IF THERE IS A SESSION TOKEN
    if (!sessionToken) {
      return res.status(403).json({
        error: {
          status: "403",
          message: "Not Authenticated",
        },
      });
    }
    res.clearCookie("XAVIA-AUTH", { domain: "localhost", path: "/" });
    return res.status(200).json({
      isLogout: true,
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      error: {
        status: "500",
        message: "Internal Server Error",
      },
    });
  }
};

// REGISTER
export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res.status(400).json({
        error: {
          status: "400",
          message: "Not found email, password or username",
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
    const role = RoleId.USER;
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