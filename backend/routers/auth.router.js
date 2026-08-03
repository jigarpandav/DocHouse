// POST   /api/auth/register
// POST   /api/auth/login
// POST   /api/auth/forgot-password
// POST   /api/auth/reset-password
// PUT    /api/auth/change-password


import express from "express";
import * as authController from "../controllers/auth.controller.js"
import multer from "multer";

const authRouter = express.Router();
const upload = multer();

authRouter.post("/register",upload.none(), authController.registerAdmin );

authRouter.post("/login",upload.none(),  authController.adminLogin);

authRouter.post("/forgot-password",upload.none(), authController.adminForgotPassword);

authRouter.post("/reset-password/:resetPasswordToken",upload.none(),  authController.adminResetPassword);

authRouter.post("/change-password", upload.none(), authController.adminChangePassword);

authRouter.post("/get" ,upload.none(), authController.getAdmin);

export default authRouter;