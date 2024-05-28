import { Category } from "../models/Category.js";
import { Food } from "../models/Food.js";
import { Ingredient } from "../models/ingredient.js";
// import { asyncForEach } from '../utils/index.js';
import {asyncForEach} from "../utils/index.js";
export const create = async (req, res, next) => {
  try {
    const data = req.body;
    const { categoryId, foodIngredient } = data;

    const getCategory = Category.findById(categoryId);
    const category = await getCategory;

    if (!category || category.isDelete) {
      return res.status(404).json({
        code: 404,
        message: 'Category not found or deleted',
      });
    }

    const errors = [];

    await asyncForEach(foodIngredient, async (item) => {
      const { ingredientId } = item;
      const ingredient = await Ingredient.findById(ingredientId);

      if (!ingredient) {
        errors.push(`Ingredient ${ingredientId} not found`);
      }
    });

    if (errors.length > 0) {
      return res.status(404).json({
        code: 404,
        message: "Không tồn tại",
        errors,
      });
    }

    const newItem = new Food(data);

    let result = await newItem.save();

    return res.send({
      code: 200,
      success: true,
      message: "Tạo thành công",
      payload: result,
    });
  } catch (error) {
    console.log("««««« err »»»»»", error);
    return res.status(500).json({ code: 500, error: error });
  }
};
export const getAll = async (req,res,next) => {
  try {
      let results = await Food.find()

      // Thêm header Cache-Control vào phản hồi
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  
      return res.send({ code: 200, payload: results });
      
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
};

export const getDetail = async (req, res, next)=>{
  try {
      const { id } = req.params;
  
      let found = await Food.findById(id)
  
      if (found) {
        return res.send({ code: 200, payload: found });
      }
  
      return res.status(410).send({ code: 404, message: 'Không tìm thấy' });
    } catch (err) {
      res.status(404).json({
        message: 'Get detail fail!!',
        payload: err,
      });
    }
}
