import express from "express";

import { passportConfigAccount, passportConfigLocalAccount } from "../middlewares/passportAdmin.js";
import passport from "passport";
import allowRoles from "../middlewares/checkRole.js";
import { create, getAll, getDetail, remove, update } from "../controllers/categoriesController.js";



//router object
const router = express.Router();


passport.use(passportConfigAccount);
passport.use(passportConfigLocalAccount);

router.post('/create',allowRoles('Create-category'),create);
router.get('/',getAll)
router.get('/:id',getDetail)
router.patch('/:id',allowRoles('Update-category'),update);
router.delete('/:id',allowRoles('Update-category'),remove);
export default router