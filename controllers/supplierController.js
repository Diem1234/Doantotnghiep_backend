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
}