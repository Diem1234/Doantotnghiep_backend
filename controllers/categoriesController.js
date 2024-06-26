import { Category } from "../models/Category.js";

export const create = async (req, res, next) =>{
    try 
    {
      const { name } = req.body;
      const photoUrl = req.file ? req.file.path : null;
      console.log('img',photoUrl)
      const newCategory = await Category.create({
        name,
        photo: photoUrl
      });
    
        let result = await newCategory.save();
            // Lấy danh sách categories mới nhất
        

        return res.send({ code: 200,success: true , message: 'Tạo thành công', payload: result });
    } 
    catch (error) 
    { 
        console.log('««««« err »»»»»', error);
        return res.status(500).json({ code: 500, error: error });
     }
};

export const getAll = async (req,res,next) => {
    try {
        let results = await Category.find()
  
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
    
        let found = await Category.findById(id)
    
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
        const found = await Category.findByIdAndUpdate(id, updateData, {
          new: true,
        });
    
        if (found) {
          return res.send({
            code: 200,
            message: 'Cập nhật thành công',
            payload: found,
            success:true,
          });
        }
  
        
        return res.status(410).send({ code: 400, message: 'Không tìm thấy' });
      } catch (error) {
        return res.status(500).json({ code: 500, error: err });
      }
};
export const remove = async (req, res, next)=>{
    try {
        const { id } = req.params;
    
        let found = await Category.findByIdAndDelete(id);
    
        if (found) {
          return res.send({ code: 200,success:  true , payload: found, message: 'Xóa thành công' });
        }
    
        return res.status(410).send({ code: 404, message: 'Không tìm thấy' });
      } catch (err) {
        return res.status(500).json({ code: 500, error: err });
      }
}