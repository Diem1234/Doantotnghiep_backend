import express from "express";

import { passportConfigAccount, passportConfigLocalAccount } from "../middlewares/passportAdmin.js";
import passport from "passport";
import allowRoles from "../middlewares/checkRole.js";
import { create, getAll, getDetail, getDetails } from "../controllers/foodController.js";



//router object
const router = express.Router();


passport.use(passportConfigAccount);
passport.use(passportConfigLocalAccount);

router.post('/create',allowRoles('Create-food'),create);
router.get('/',getAll)
router.get('/:id',getDetail)
router.get('/detail/:id',getDetails)


export default router