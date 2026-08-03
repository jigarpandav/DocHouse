// POST    /api/templates/create
// POST    /api/templates/all
// POST    /api/templates/:templateId
// PUT     /api/templates/update
// POST    /api/templates/delete
// POST    /api/templates/delete-all



import express from "express";
import * as templateController from "../controllers/template.controller.js"
import multer from "multer";


const templateRouter = express.Router();
const upload = multer();

templateRouter.post("/create", upload.none(), templateController.createTemplate);

templateRouter.put("/update", upload.none(), templateController.updateTemplate);

templateRouter.post("/get", upload.none(), templateController.getTemplateById
);

templateRouter.post("/get-all", upload.none(), templateController.getAllTemplates);

templateRouter.post("/delete", upload.none(), templateController.deleteTemplateById);

templateRouter.post("/delete-all", upload.none(), templateController.deleteAllTemplate)

export default templateRouter;
