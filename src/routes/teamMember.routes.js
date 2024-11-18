import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { addTeamMember } from "../controllers/TeamMember/AddTeamMember.controller.js";
import { editTeamMember } from "../controllers/TeamMember/EditMemberProfile.controller.js";
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

router.route("/update/:memberId").put(
      upload.fields([
            {
                  name: "avatar",
                  maxCount: 1,
            },
      ]),
      editTeamMember
);

router.route("/delete/:_id").delete(removeTeamMember);
router.route("/").get(getAllTeamMember);
router.route("/:id").get(getSingleTeamMember);

export default router;
