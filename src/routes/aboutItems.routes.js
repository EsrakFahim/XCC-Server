import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { addAboutItems } from "../controllers/Pages/About/AddAboutItems.controller.js";
import { editAboutItems } from "../controllers/Pages/About/EditAboutItems.controller.js";
import { getAboutItems } from "../controllers/Pages/About/GetAboutItems.controller.js";

const router = Router();

// Route for creating a new project with file uploads
router.route("/").post(
      upload.fields([
            {
                  name: "images",
                  maxCount: 10, // Adjust maxCount as needed
            },
      ]),
      addAboutItems
);

// Route for updating an existing project with file uploads
router.route("/").put(
      upload.fields([
            {
                  name: "images",
                  maxCount: 10, // Adjust maxCount as needed
            },
      ]),
      editAboutItems
);
router.route('/').get(getAboutItems);

export default router;
