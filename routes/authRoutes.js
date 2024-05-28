import express from "express";
import { loginAccount, registerAccount,createMember } from "../controllers/authController.js";
import { passportConfigAccount, passportConfigLocalAccount } from "../middlewares/passportAdmin.js";
import passport from "passport";



//router object
const router = express.Router();


passport.use(passportConfigAccount);
passport.use(passportConfigLocalAccount);

//routes
//   router.get("/admin-auth", allowRoles, (req, res) => {
//     res.status(200).send({ok:true});
//   });
router.post('/register', registerAccount);
router.post('/login',passport.authenticate('localAdmin', { session: false }),loginAccount)
router.post('/:accountId/creatMember',passport.authenticate('jwtAdmin', { session: false }),createMember)
export default router