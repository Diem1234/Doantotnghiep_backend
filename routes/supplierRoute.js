import express from "express";

import { passportConfigAccount, passportConfigLocalAccount } from "../middlewares/passportAdmin.js";
import passport from "passport";

import { create } from "../controllers/categoriesController.js";
import { createSupplier } from "../controllers/supplierController.js";



//router object
const router = express.Router();


passport.use(passportConfigAccount);
passport.use(passportConfigLocalAccount);

router.post('/createSupplier',createSupplier);




export default router