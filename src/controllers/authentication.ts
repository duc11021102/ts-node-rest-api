import express from "express";
import jwt from "jsonwebtoken";
import { getUserByEmail, createUser } from "../db/user";
import { authentication, random } from "../helpers";
import { RoleId } from "db/role";
require("dotenv").config();

//GET ACCESS TOKEN
export const getAccessToken = async (
  req: express.Request,
  res: express.Response,
) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({
      is_error: true,
      error: {
        code: 401,
        message: "Not found refreshToken",
      },
    });
  }
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET_KEY,
    (err: any, user: any) => {
      if (err) {
        return res.status(401).json({
          is_error: true,
          error: {
            code: 401,
            message: "Login session expired.",
          },
        });
      }
      const accessToken = jwt.sign(
        { id: user.id },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        { expiresIn: "1h" },
      );
      res.json({ accessToken });
    },
  );
};

// LOGIN
export const login = async (req: express.Request, res: express.Response) => {
  try {
    //EXPRESS.REQUEST IS AN OBJECT THAT CONTAINS INFORMATION ABOUT THE HTTP REQUEST
    //EXPRESS.RESPONSE IS AN OBJECT USED TO SEND HTTP RESPONSE TO CLIENT
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        is_error: true,
        error: {
          code: 400,
          message: "Not found email or password",
        },
      });
    }

    // GET CLIENT DOMAIN FROM REQ
    // const clientHost = clientHostName(req);
    // // CHECK IF THE DOMAIN IS INVALID
    // const validDomain = getValidDomain(clientHost);
    // if (
    //   validDomain === "" ||
    //   validDomain === null ||
    //   validDomain === undefined
    // ) {
    //   console.log(typeof validDomain);
    //   return res.status(400).json({
    //     error: {
    //       is_error: true,
    //       code: 400,
    //       message: "Invalid hostname!!!",
    //     },
    //   });
    // }

    // RETURN USER WITH 2 FIELDS authentication.salt AND authentication.password
    // .select() sẽ trả về thêm 2 trường nữa là salt và password, mặc định thì 2 trường này không đc trả về
    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password",
    );
    if (!user) {
      return res.status(400).json({
        is_error: true,
        error: {
          code: 400,
          message: "Wrong email or password",
        },
      });
    }

    // HASHING USER.AUTHENTICATION.SALT AND PASSWORD RETURN A HASH CODE
    const expectedHash = authentication(user.authentication.salt, password);

    // CHECK IF THE PASSWORD IS CORRECT
    if (user.authentication.password != expectedHash) {
      return res.status(403).json({
        is_error: true,
        error: {
          code: 400,
          message: "Wrong password",
        },
      });
    }

    //CREATE REFRESH TOKEN
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET_KEY,
      { expiresIn: "24h" },
    );

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
      domain: "",
      path: "/",
      expires: new Date(Date.now() + 86400000),
    });
    res.cookie("refreshToken", refreshToken, {
      domain: "",
      path: "/",
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
      error: {
        is_error: true,
        code: 400,
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
        is_error: true,
        error: {
          code: 403,
          message: "Not Authenticated",
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

    res.clearCookie("XAVIA-AUTH", {
      domain: "",
      path: "/",
    });
    res.clearCookie("refreshToken", {
      domain: "",
      path: "/",
    });
    return res.status(200).json({
      is_success: true,
      isLogout: true,
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      is_error: true,
      error: {
        code: 500,
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
        is_error: true,
        error: {
          code: 400,
          message: "Not found email, password or username",
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
