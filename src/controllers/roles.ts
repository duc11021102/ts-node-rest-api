import express from "express";

import { getRoles, getRoleByCodeDtl, createRole } from "../db/role";

//GET ALL ROLES
export const getAllRoles = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const roles = await getRoles();
    return res.status(200).json({
      is_success: true,
      data: roles,
      total: roles.length,
    });
  } catch (error) {
    return res.status(400).json({
      is_error: true,
      error: {
        code: 400,
        message: "Cannot get all roles",
      },
    });
  }
};
// CREATE ROLE
// SEND { "codeDtl : "String"}
export const createRoles = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { codeDtl } = req.body;
    if (!codeDtl) {
      return res.status(400).json({
        is_error: true,
        error: {
          code: 400,
          message: "Not found codeDtl",
        },
      });
    }

    const existingRole = await getRoleByCodeDtl(codeDtl);

    if (existingRole) {
      return res.status(400).json({
        is_error: true,
        error: {
          code: 400,
          message: "Role already exists",
        },
      });
    }

    //CREATE CODEID USING CODEDTL
    let codeId: Number;
    codeId = codeDtl === "admin" ? 1 : 2;

    const role = await createRole({
      codeDtl,
      codeId: codeId,
      createAt: new Date(),
    });

    return res
      .status(200)
      .json({
        is_success: true,
        data: role,
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
