import express from "express";

import { passportConfigAccount, passportConfigLocalAccount } from "../middlewares/passportAdmin.js";
import passport from "passport";

import { createSupplier, getAll, getDetail } from "../controllers/supplierController.js";



//router object
const router = express.Router();


passport.use(passportConfigAccount);
passport.use(passportConfigLocalAccount);

router.post('/createSupplier',createSupplier);
router.get('/',getAll)
router.get('/:id',getDetail)


export default router