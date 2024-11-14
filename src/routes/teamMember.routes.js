import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { addTeamMember } from "../controllers/TeamMember/AddTeamMember.controller.js";
import { editMemberProfile } from "../controllers/TeamMember/EditMemberProfile.controller.js";
import { removeTeamMember } from "../controllers/TeamMember/RemoveTeamMember.controller.js";
import { getAllTeamMember } from "../controllers/TeamMember/GetAllTeamMember.controller.js";
import { getSingleTeamMember } from "../controllers/TeamMember/GetSingleTeamMember.controller.js";

const router = Router();

router.route("/add").post(
      upload.fields([
            {
                  name: "avatar",
                  maxCount: 1,
            },
      ]),
      addTeamMember
);

router.route("/update").put(
      upload.fields([
            {
                  name: "avatar",
                  maxCount: 1,
            },
      ]),
      editMemberProfile
);

router.route("/delete").delete(removeTeamMember);
router.route("/").get(getAllTeamMember);
router.route("/:id").get(getSingleTeamMember);

export default router;
