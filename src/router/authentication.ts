import express from "express";

import {
  login,
  register,
  logout,
  getAccessToken,
} from "../controllers/authentication";
import { isAuthenticated } from "../middlewares";
/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login
 *     description: Login to system
 *     operationId: login
 *     requestBody:
 *       description: Information for login
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: abc@gmail.com
 *               password:
 *                 type: string
 *                 example: abc123
 *     responses:
 *       "200":
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 is_success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     authentication:
 *                       type: object
 *                       properties:
 *                         password:
 *                           type: string
 *                           example: string
 *                         salt:
 *                           type: string
 *                           example: string
 *                         sessionToken:
 *                           type: string
 *                           example: string
 *                 _id:
 *                   type: string
 *                   example: 65f68d0e27ca65d411e13bd6
 *                 email:
 *                   type: string
 *                   example: abc@gmail.com
 *                 username:
 *                   type: string
 *                   example: abc
 *                 role:
 *                   type: number
 *                   example: 0
 *                 _v:
 *                   type: number
 *                   example: 0
 *       "400":
 *         description: Invalid input
 *       "404":
 *         description: Not found
 *       "422":
 *         description: Validation exception
 */

export default (router: express.Router) => {
  router.post("/auth/register", register);
  router.post("/auth/login", login);
  router.post("/auth/logout", logout);
  router.post("/auth/refreshToken", isAuthenticated, getAccessToken);
};
