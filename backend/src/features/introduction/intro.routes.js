// routes/paths to ProductController
import express from "express";
import IntroController from "./intro.controller.js";
import { upload } from "../../middleware/fileUpload.middleware.js";

const IntroRouter = express.Router();

const introController = new IntroController();

// Paths to controller methods
IntroRouter.post('/add', upload.single('imageUrl'), (req, res) => {
	introController.add(req, res);
});

IntroRouter.get('/', (req, res) => {
	introController.getAll(req, res)
});

IntroRouter.put('/:id', upload.single('imageUrl'), (req, res) => {
	introController.update(req, res)
});

export default IntroRouter;