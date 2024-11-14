import { Router } from "express";
import { addHomeItems } from "../controllers/Pages/HomePage/AddHomeItems.controller.js";
import { editHomeItems } from "../controllers/Pages/HomePage/EditHomeItems.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { getHomeItems } from "../controllers/Pages/HomePage/GetHomeItems.controller.js";

const router = Router();

router.route("/").post(
      upload.fields([
            {
                  name: "bannerImage",
                  maxCount: 1,
            },
            {
                  name: "video",
                  maxCount: 1,
            },
      ]),
      addHomeItems
);
router.route("/").put(
      upload.fields([
            {
                  name: "bannerImage",
                  maxCount: 1,
            },
            {
                  name: "video",
                  maxCount: 1,
            },
      ]),
      editHomeItems
);
router.route("/").get(getHomeItems);

export default router;
