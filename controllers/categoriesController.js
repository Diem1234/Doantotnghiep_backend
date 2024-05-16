import { Category } from "../models/Category.js";

export const create = async (req, res, next) =>{
    try 
    {
        const data = req.body;

        const newItem = new Category(data);
    
        let result = await newItem.save();
    
        return res.send({ code: 200,success: true , message: 'Tạo thành công', payload: result });
    } 
    catch (error) 
    { 
        console.log('««««« err »»»»»', error);
        return res.status(500).json({ code: 500, error: error });
     }
};