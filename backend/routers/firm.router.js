// POST    /api/firm/create             // Create firm
// POST    /api/firm/get                // Get logged-in admin's firm
// PUT     /api/firm/update             // Update firm
// PUT     /api/firm/update-logo        // Update logo
// PUT     /api/firm/update-qrcode      // Update QR code

import express from "express";
import * as firmController from "../controllers/firm.controller.js";
import upload from "../middleware/upload.middleware.js"

const firmRouter = express.Router();

// Create Firm
firmRouter.post(
  "/create",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "qrCode", maxCount: 1 },
  ]),
 firmController.createFirm
);

// Get Firm By Id
firmRouter.post("/get",upload.none(), firmController.getFirmById);

// Update Firm Details (Logo & QR Code optional)
firmRouter.put(
  "/update",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "qrCode", maxCount: 1 },
  ]),
  firmController.updateFirm
);

// Update Only Logo
firmRouter.put(
  "/update-logo",
  upload.fields([
    { name: "logo", maxCount: 1 },
  ]),
  firmController.updateFirmLogo
);

// Update Only QR Code
firmRouter.put(
  "/update-qrcode",
  upload.fields([
    { name: "qrCode", maxCount: 1 },
  ]),
  firmController.updateFirmQrCode
);

export default firmRouter;
