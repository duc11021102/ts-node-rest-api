import express from "express";
import { merge, get } from "lodash";
import jwt from "jsonwebtoken";
import { getUserBySessionToken } from "../db/user";
require("dotenv").config();

//CHECK AUTHORIZATION
export const authenToken = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const authorizationHeader = req.headers["authorization"];
    if (!authorizationHeader) {
      return res.status(401).json({
        is_error: true,
        error: {
          code: 401,
          message: "Unauthorization",
        },
      });
    }
    const accessToken = authorizationHeader.split(" ")[1];
    if (!accessToken) {
      return res.status(401).json({
        is_error: true,
        error: {
          code: 401,
          message: "Unauthorization",
        },
      });
    }
    jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET_KEY,
      (err: any, data: any) => {
        if (err) {
          return res.status(403).json({
            is_error: true,
            error: {
              code: 403,
              message: "Forbidden",
            },
          });
        }
        next();
      },
    );
    // return next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      is_error: true,
      error: {
        code: 401,
        message: "Error",
      },
    });
  }
};

//CHECK IF YOU ARE LOGGED IN OR NOT
export const isAuthenticated = async (
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
          message: "Not Found SessionToken",
        },
      });
    }
    // CHECK IF THERE IS A USER WITH SESSION TOKEN
    const existingUser = await getUserBySessionToken(sessionToken);

    if (!existingUser) {
      return res.status(403).json({
        is_error: true,
        error: {
          code: 403,
          message: "Not Found User",
        },
      });
    }
    // ATTACH USER INFORMATION TO THE REQUEST AS AUTHENTICATED
    merge(req, { identity: existingUser });
    // GO TO THE NEXT MIDDLEWARE
    return next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({
      is_error: true,
      error: {
        code: 403,
        message: "Error",
      },
    });
  }
};

// CHECK IF THE OPERATION IS UNDER THE AUTHORITY OF THE LOGIN PERSON
// COMPLETE LOGIN, THERE WILL BE DATA OF EXISTING USER FROM isAuthenticated FUNCTION
// ASSIGN EXISTING USER INFORMATION TO LODASH USING THE MERGE FUNCTION
// isOwner WILL USE GET TO GET DATA OF THE EXISTING USER JUST LOGGED INTO PROCESS THE NEXT STEPS
// isAdminOrOwner WILL CHECK IF THE USER IS AN ADMIN OR OWNER.
export const isAdminOrOwnerisOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const { id } = req.params;
    // ACCESS USER ID VALUE FROM REQ JUST ASSIGNED FROM isAuthenticated
    const currentUserId = get(req, "identity._id") as string;

    if (!currentUserId) {
      return res.status(400).json({
        is_error: true,
        error: {
          code: 400,
          message: "Error",
        },
      });
    }

    if (currentUserId.toString() !== id) {
      return res.status(403).json({
        is_error: true,
        error: {
          code: 403,
          message: "Not Authenticated",
        },
      });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      is_error: true,
      error: {
        code: 400,
        message: "Error",
      },
    });
  }
};

export const isAdmin = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const currentUserRole = get(req, "identity.role") as Number;
    if (!currentUserRole) {
      return res.status(400).json({
        is_error: true,
        error: {
          code: 400,
          message: "Error",
        },
      });
    }

    if (+currentUserRole !== 1) {
      console.log("Not Admin");
      return res.status(403).json({
        is_error: true,
        error: {
          code: 403,
          message:
            "You do not have permission to register for an admin account",
        },
      });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      is_error: true,
      error: {
        code: 400,
        message: "Error",
      },
    });
  }
};

export const isAdminOrOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const currentUserRole = get(req, "identity.role") as Number;
    const { id } = req.params;
    const currentUserId = get(req, "identity._id") as string;
    if (!currentUserRole || !currentUserId) {
      return res.status(400).json({
        is_error: true,
        error: {
          code: 400,
          message: "Error",
        },
      });
    }
    if (+currentUserRole === 1 || currentUserId.toString() === id) {
      next();
    } else {
      return res.status(403).json({
        is_error: true,
        error: {
          code: 403,
          message: "Not Authenticated",
        },
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      is_error: true,
      error: {
        code: 400,
        message: "Error",
      },
    });
  }
};
