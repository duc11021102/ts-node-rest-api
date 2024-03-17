import express from "express";
import { merge, get } from "lodash";

import { getUserBySessionToken } from "../db/user";

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
        error: {
          status: "403",
          message: "Not Authenticated",
        },
      });
    }
    // CHECK IF THERE IS A USER WITH SESSION TOKEN
    const existingUser = await getUserBySessionToken(sessionToken);

    if (!existingUser) {
      return res.status(403).json({
        error: {
          status: "403",
          message: "Not Authenticated",
        },
      });
    }
    // ATTACH USER INFORMATION TO THE REQUEST AS AUTHENTICATED
    merge(req, { identity: existingUser });
    // GO TO THE NEXT MIDDLEWARE
    return next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: {
        status: "403",
        message: "Error",
      },
    });
  }
};

// CHECK IF THE OPERATION IS UNDER THE AUTHORITY OF THE LOGIN PERSON
// COMPLETE LOGIN, THERE WILL BE DATA OF EXISTING USER FROM isAuthenticated FUNCTION
// ASSIGN EXISTING USER INFORMATION TO LODASH USING THE MERGE FUNCTION
// isOwner WILL USE GET TO GET DATA OF THE EXISTING USER JUST LOGGED INTO PROCESS THE NEXT STEPS
export const isOwner = async (
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
        error: {
          status: "400",
          message: "Error",
        },
      });
    }

    if (currentUserId.toString() !== id) {
      return res.status(403).json({
        error: {
          status: "403",
          message: "Not Authenticated",
        },
      });
    }

    next();
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

export const isAdmin = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const currentUserRole = get(req, "identity.role") as Number;
    if (!currentUserRole) {
      return res.status(400).json({
        error: {
          status: "400",
          message: "Error",
        },
      });
    }

    if (+currentUserRole !== 1) {
      console.log("Not Admin");
      return res.status(403).json({
        error: {
          status: "403",
          message: "Not Authenticated",
        },
      });
    }

    next();
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
