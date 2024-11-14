import { Router } from "express";
import { getAllPricePlans } from "../controllers/Price/GetAllPricePlan.controller.js";
import { getSinglePricePlan } from "../controllers/Price/GetSinglePricePan.controller.js";
import { createPricingPlan } from "../controllers/Price/AddPrice.controller.js";
import { editPricingPlan } from "../controllers/Price/EditPricePlans.controller.js";
import { deletePricingPlan } from "../controllers/Price/DeletePricePlan.controller.js";

const router = Router();

router.route("/").get(getAllPricePlans);
router.route("/:id").get(getSinglePricePlan);
router.route("/add").post(createPricingPlan); // tested
router.route("/update/:_id").put(editPricingPlan); // tested
router.route("/delete/:_id").delete(deletePricingPlan);

export default router;
