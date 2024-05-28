import express from "express";

import { passportConfigAccount, passportConfigLocalAccount } from "../middlewares/passportAdmin.js";
import passport from "passport";
import allowRoles from "../middlewares/checkRole.js";
import { create, getAll, getDetail, update } from "../controllers/ingredienCondtroller.js";



//router object
const router = express.Router();


passport.use(passportConfigAccount);
passport.use(passportConfigLocalAccount);

router.post('/create',allowRoles('Create-ingredient'),create);
router.get('/',getAll)
router.get('/:id',getDetail)
router.patch('/:id',allowRoles('Update-ingredient'),update);



export default router