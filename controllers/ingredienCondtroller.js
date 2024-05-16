import { Ingredient } from "../models/ingredient.js";
import { Supplier } from "../models/supplier.js";

export const create = async (req, res, next) => {
  try {
    const data = req.body;
    const { supplierId } = data;
    const findSupplier = Supplier.findById(supplierId);

    const [supplier] = await Promise.all([findSupplier]);

    const errors = [];
   if (!supplier) errors.push('Nhà cung cấp không tồn tại');

    if (errors.length > 0) {
      return res.status(404).json({
        code: 404,
        message: "Không tồn tại",
        errors,
      });
    }

    const newItem = new Ingredient(data);

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
