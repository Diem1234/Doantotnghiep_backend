import express from "express";
import { loginAccount, registerAccount,createMember, getAll, getDetail, getMe, updateProfileController, addFamilyMembers, memberSearch, memberStatusTwo, memberStatusFilter, deleteFamilyMember, updateFamilyMember } from "../controllers/authController.js";
import { passportConfigAccount, passportConfigLocalAccount } from "../middlewares/passportAdmin.js";
import passport from "passport";

import allowRoles from "../middlewares/checkRole.js";



//router object
const router = express.Router();


passport.use(passportConfigAccount);
passport.use(passportConfigLocalAccount);

//routes
//   router.get("/admin-auth", allowRoles, (req, res) => {
//     res.status(200).send({ok:true});
//   });
router.post('/register', registerAccount);
router.post('/login'
            //  ,passport.authenticate('localAdmin', { session: false })
            ,loginAccount)
router.post('/:accountId/creatMember',passport.authenticate('jwtAdmin', { session: false }),createMember)
router.get('/',passport.authenticate('jwtAdmin', { session: false }),allowRoles('Get-all'),getAll)
router.get('/:id',passport.authenticate('jwtAdmin', { session: false }),getDetail)

router.get('/profile',passport.authenticate('jwtAdmin', { session: false }), getMe)
// router.put('/profile',passport.authenticate('jwtAdmin', { session: false }), addFamilyMembers)
router.get('/member/search',memberSearch);
router.get('/member/status-filter',memberStatusFilter);
// delete member
router.delete('/accounts/:accountId/family-members/:familyMemberId', deleteFamilyMember);
// Route cập nhật family member
router.put('/accounts/:accountId/family-members/:familyMemberId', updateFamilyMember);

export default router