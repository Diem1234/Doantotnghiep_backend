import express from "express";

import { passportConfigAccount, passportConfigLocalAccount } from "../middlewares/passportAdmin.js";
import passport from "passport";
import allowRoles from "../middlewares/checkRole.js";
import { create, deleteFoood, foodFilterController, foodSearch, getAll, getDetail, getDetails, getFoodsByCategoryId, relatedProductController, update, updateIsDelete } from "../controllers/foodController.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import { v2 as cloudinary } from 'cloudinary';


//router object
const router = express.Router();
    // Configuration
    cloudinary.config({ 
        cloud_name: 'dtd9zqkar', 
        api_key: '545728927133443', 
        api_secret: '-gxkDn1KYxeSe99882uwsrNC7vM' // Click 'View Credentials' below to copy your API secret
    });
// Cấu hình multer-storage-cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "food-delivery-app/categories",
        format: (req, file) => {
            const fileExtension = file.originalname.split('.').pop().toLowerCase();
            if (['jpg', 'png', 'jpeg'].includes(fileExtension)) {
              return fileExtension;
            } else {
              throw new Error('Invalid file extension');
            }
          }
      }

  });
  
  const upload = multer({ storage: storage });

passport.use(passportConfigAccount);
passport.use(passportConfigLocalAccount);

router.post('/create',allowRoles('Create-food'),upload.single('photo'),create);
router.get('/',getAll)
router.get('/:id',getDetail)
router.get('/detail/:id',getDetails)
router.delete('/:id',deleteFoood)
router.post('/delete',allowRoles('IsDelete'),updateIsDelete);
router.patch('/:id',allowRoles('Update-food'),update);
router.get('/foods/search',foodSearch);
router.get('/related-product/:pid/:cid', relatedProductController);
router.post('/food-filters', foodFilterController);
router.get('/foods/category/:categoryId', getFoodsByCategoryId);


export default router