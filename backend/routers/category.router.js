import express from "express";
import multer from "multer";

import * as categoryController from "../controllers/category.controller.js";

const cateRouter = express.Router();
const upload = multer();

cateRouter.post("/create", upload.none(), categoryController.createCategory);

cateRouter.put("/update", upload.none(), categoryController.updateCategory);

cateRouter.get("/get/:categoryId", upload.none(), categoryController.getCategoryById );

cateRouter.post("/get-all", upload.none(), categoryController.getAllCategory);

cateRouter.delete("/delete/:categoryId", upload.none(), categoryController.deleteCategory)

cateRouter.post("/delete-all", upload.none(), categoryController.deleteAllCategory)

export default cateRouter;