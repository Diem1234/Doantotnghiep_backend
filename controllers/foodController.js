import { Category } from "../models/Category.js";
import { Food } from "../models/Food.js";
import { Ingredient } from "../models/Ingredient.js";
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

export const getDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const food = await Food.findById(id)
      .populate('foodIngredient.ingredientId')
      .populate('categoryId');

    if (food) {
      const foodWithDetails = {
        ...food.toObject(),
        foodIngredient: food.foodIngredient.map(ingredient => ({
          ...ingredient.toObject(),
          ingredientName: ingredient.ingredientId.name
        })),
        categoryName: food.categoryId.name
      };

      return res.status(200).json({ code: 200, payload: foodWithDetails });
    }

    return res.status(404).json({ code: 404, message: 'Không tìm thấy' });
  } catch (err) {
    return res.status(500).json({
      message: 'Get detail fail!!',
      payload: err.message
    });
  }
};
export const updateIsDelete = async (req, res, next) => {
  const { selectedIds } = req.body; // Lấy danh sách các ID từ yêu cầu

  try {
    // Thực hiện cập nhật cho từng ID trong danh sách
    const result = await Food.updateMany(
      { _id: { $in: selectedIds } }, // Tìm các sản phẩm có ID trong danh sách
      { $set: { isDelete: true } } // Cập nhật trường isDelete thành true
    );

    res.status(200).json({ message: 'Cập nhật thành công',success: true, payload: result });
  } catch (error) {
    res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình cập nhật' });
  }
};
export const deleteFoood = async (req, res, next) => {
  try {
    const { id } = req.params;

    let found = await Food.findByIdAndDelete(id);

    if (found) {
      return res.send({ code: 200,success:true, payload: found, message: 'Xóa thành công' });
    }

    return res.status(410).send({ code: 404, message: 'Không tìm thấy' });
  } catch (err) {
    return res.status(500).json({ code: 500, error: err });
  }
};
export const foodSearch = async (req, res, next) => {
  try {
    const { name } = req.query;
    const conditionFind = {
      name: { $regex: new RegExp(`${name}`), $options: "i" },
    };
    let results = await Food.find(conditionFind)
      .populate({
        path: "category",
        select: "name", // Chỉ lấy trường "name" từ bảng "category"
      })
  
    // Đối chiếu mã danh mục và hiển thị tên danh mục
    results = results.map((product) => {
      const category = product.category ? product.category.name : "";
      return { ...product._doc, category };
    });

      res.send({ code: 200, payload: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
};


//similar product
export const relatedProductController = async (req,res,next) =>{
  try {
      const {pid,cid} = req.params;
      const foods = await Food
          .find({
              categoryId: cid,
              _id: {$ne: pid}
          })
          .limit(4)
          .populate("category");
      res.status(200).send({
          success: true,
          payload: foods,
      });    
  } catch (error) {
      console.log(error);
      res.status(400).send({
          success: false,
          message: 'Error while getting related food',
          error
      });
  }
};

export const foodFilterController =  async (req,res) =>{
  try {
      const {checked,radio} = req.body;
      let args = {};
      if(checked.length > 0) args.categoryId= checked;
      if(radio.length) args.price = {$gte: radio[0],$lte:radio[1]};
      const products = await Food.find(args);
      res.status(200).send({
          success: true,
          payload: products
      });
  } catch (error) {
      console.log(error);
      res.status(400).send({
          success: false,
          message: 'Error while Filtering product',
          error
      });
      
  }
};
