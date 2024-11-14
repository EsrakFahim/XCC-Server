import { Router } from "express";
import { createContact } from "../controllers/Contact/Contact.controllers.js";
import { getContact } from "../controllers/Contact/ContactGet.controllers.js";


const router = Router();

router.route("/social").post(createContact);
router.route("/social-get").get(getContact);


export default router;