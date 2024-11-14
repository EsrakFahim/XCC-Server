import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { CreateServices } from "../controllers/OurServices/CreateServices.controller.js";
import { EditServices } from "../controllers/OurServices/EditServices.controller.js";
import { DeleteService } from "../controllers/OurServices/DeleteServices.controller.js";
import { GetAllServices } from "../controllers/OurServices/GetAllServices.controller.js";
import { getSingleService } from "../controllers/OurServices/GetSingleService.controller.js";

const router = Router();

router.route("/upload").post(
      upload.fields([
            {
                  name: "coverImage",
                  maxCount: 1,
            },
            {
                  name: "showcaseImages",
                  maxCount: 1,
            },
      ]),
      CreateServices
);
router.route("/update").put(
      upload.fields([
            {
                  name: "coverImage",
                  maxCount: 1,
            },
            {
                  name: "showcaseImages",
                  maxCount: 1,
            },
      ]),
      EditServices
);
router.route("/delete").delete(DeleteService);
router.route("/").get(GetAllServices);
router.route("/:slug").get(getSingleService);

export default router;
