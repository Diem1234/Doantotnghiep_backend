import express from "express";

import { passportConfigAccount, passportConfigLocalAccount } from "../middlewares/passportAdmin.js";
import passport from "passport";
import allowRoles from "../middlewares/checkRole.js";
import { create, deleteFoood, foodFilterController, foodSearch, getAll, getDetail, getDetails, getFoodsByCategoryId, relatedProductController, updateIsDelete } from "../controllers/foodController.js";



//router object
const router = express.Router();


passport.use(passportConfigAccount);
passport.use(passportConfigLocalAccount);

router.post('/create',allowRoles('Create-food'),create);
router.get('/',getAll)
router.get('/:id',getDetail)
router.get('/detail/:id',getDetails)
router.delete('/:id',deleteFoood)
router.post('/delete',allowRoles('IsDelete'),updateIsDelete);
router.get('/foods/search',foodSearch);
router.get('/related-product/:pid/:cid', relatedProductController);
router.post('/food-filters', foodFilterController);
router.get('/foods/category/:categoryId', getFoodsByCategoryId);


export default router