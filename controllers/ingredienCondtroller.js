import { Supplier } from "../models/Supplier.js";
import { Ingredient } from "../models/ingredient.js";


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
export const getAll = async (req,res,next) => {
  try {
      let results = await Ingredient.find()

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
  
      let found = await Ingredient.findById(id)
  
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
};

export const update = async (req, res, next)=>{
  try {
    const { id } = req.params;  
    const updateData = req.body;
    const { supplierId } = updateData;

    const findSupplier = Supplier.findById(supplierId);

    const [ supplier] = await Promise.all([ findSupplier]);

    const errors = [];
    if (!supplier || supplier.isDelete) errors.push('Nhà cung cấp không tồn tại');

    if (errors.length > 0) {
      return res.status(404).json({
        code: 404,
        message: "Không tồn tại",
        errors,
      });
    }

    const found = await Ingredient.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (found) {
      return res.send({
        code: 200,success:true,
        message: 'Cập nhật thành công',
        payload: found,
      });
    }

    return res.status(410).send({ code: 400, message: 'Không tìm thấy' });
  } catch (error) {
    return res.status(500).json({ code: 500, error: err });
  }
}
