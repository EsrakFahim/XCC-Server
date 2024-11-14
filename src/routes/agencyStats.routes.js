import { Router } from "express";
import { getAllAgencyStats } from "../controllers/AgencyStats/GetAllAgencyStats.controller.js";
import { getSingleAgencyStats } from "../controllers/AgencyStats/GetSingleAgencyStats.controller.js";
import { deleteAgencyStats } from "../controllers/AgencyStats/DeleteAgencyStats.controller.js";
import { updateAgencyStats } from "../controllers/AgencyStats/EditAgencyStats.controller.js";
import { addAgencyStats } from "../controllers/AgencyStats/AddAgencyStats.controller.js";

const router = Router();

router.route("/").get(getAllAgencyStats);
router.route("/:id").get(getSingleAgencyStats);
router.route("/:id").delete(deleteAgencyStats);
router.route("/:id").put(updateAgencyStats);
router.route("/add").post(addAgencyStats);

export default router;
