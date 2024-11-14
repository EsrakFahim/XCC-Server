import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { CreateProject } from "../controllers/Projects/CreateProjects.controller.js";
import { EditProject } from "../controllers/Projects/EditProjects.controller.js";
import { deleteProjects } from "../controllers/Projects/DeleteProjects.controller.js";
import {
      getAllProjects,
      getProjectTypes,
} from "../controllers/Projects/GetAllProjects.controller.js";
import { getSingleProject } from "../controllers/Projects/GetSingleProjects.controller.js";

const router = Router();

// Route for creating a new project with file uploads
router.route("/create").post(
      upload.array("files", 10), // Handling multiple file uploads
      CreateProject
);

// Route for updating an existing project with file uploads
router.route("/update/:id").put(
      upload.fields([
            {
                  name: "files",
                  maxCount: 10, // Adjust maxCount as needed
            },
      ]),
      EditProject
);

// Route for deleting a project by ID
router.route("/delete/:id").delete(deleteProjects);

// Route for retrieving all projects
router.route("/").get(getAllProjects);

// Route for retrieving project types
router.route("/types").get(getProjectTypes);

// Route for retrieving a single project by ID
router.route("/:id").get(getSingleProject);

export default router;
