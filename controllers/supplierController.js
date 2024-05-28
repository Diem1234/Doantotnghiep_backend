import { Supplier } from "../models/supplier.js";


export const createSupplier = async (req, res) => {
    try {
        const data = req.body;
  
        const { email, phoneNumber } = data;
  
        const getEmailExits = Supplier.find({ email });
        const getPhoneExits = Supplier.find({ phoneNumber });
  
        const [foundEmail, foundPhoneNumber] = await Promise.all([
          getEmailExits,
          getPhoneExits,
        ]);
  
        const errors = [];
        if (foundEmail && foundEmail.length > 0) errors.push("Email đã tồn tại");
        // if (!isEmpty(foundEmail)) errors.push('Email đã tồn tại');
        if (foundPhoneNumber && foundPhoneNumber.length > 0)
          errors.push("Số điện thoại đã tồn tại");
  
        if (errors.length > 0) {
          return res.status(404).json({
            code: 404,
            message: "Không thành công",
            errors,
          });
        }
  
        const newItem = new Supplier(data);
  
        let result = await newItem.save();
  
        return res.send({
          code: 200,
          message: "Tạo thành công",
          payload: result,
        });
      } catch (err) {
        console.log("««««« err »»»»»", err);
        return res.status(500).json({ code: 500, error: err });
      }
};

export const getAll = async (req,res,next) => {
  try {
      let results = await Supplier.find()

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
  
      let found = await Supplier.findById(id)
  
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