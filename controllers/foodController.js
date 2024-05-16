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
