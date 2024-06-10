

import { hashPassword } from "../helpers/authHelper.js";
import { generateRefreshToken, generateToken } from "../helpers/jwtHelper.js";
import { Account } from "../models/Account.js";


// Endpoint for registering an account
export const registerAccount = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the email already exists
    const existingAccount = await Account.findOne({ email });
    if (existingAccount) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Create a new account instance
    const newAccount = new Account({ email, password });

    // Save the account to the database
    await newAccount.save();

    res.status(201).json({
      success: true,
      message: "Account created successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};

// login
export const loginAccount = async (req, res,next) => { 
  try {
    const { email} = req.body;
    // Check if the email exists 
    const existingAccount = await Account.findOne({ email }).select('-password').lean();
    const token = generateToken(existingAccount, process.env.JWT_SECRET);
    const refreshToken = generateRefreshToken(existingAccount._id, process.env.JWT_SECRET);
      return res.status(200).json({
        token,
        refreshToken,
        user: existingAccount,
      });
  }
  catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};
// API để thêm nhiều familyMembers
export const addFamilyMembers = async (req, res) => {
  try {
    const { accountId } = req.params;
    const { familyMembers,password } = req.body;

    // Tìm tài khoản
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ message: 'Tài khoản không tồn tại' });
    }
    // Thêm nhiều familyMembers vào mảng
    account.familyMembers.push(...familyMembers);


    // Lưu tài khoản
    await account.save();

    return res.status(200).json({ message: 'Đã thêm các thành viên gia đình' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const createMember = async(req,res,next) =>{
  try {
    const { accountId } = req.params;
    const members = req.body;

    // Tìm tài khoản theo accountId
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ error: 'Không tìm thấy tài khoản' });
    }

    const newMembers = members.map(member => ({
      name: member.name,
      gender: member.gender,
      status: member.status,
      trend: member.trend,
      age: member.age,
      phone: member.phone,
    }));

    // Thêm thành viên vào tài khoản
    account.familyMembers.push(...newMembers);

    // Lưu tài khoản cùng thành viên mới vào cơ sở dữ liệu
    const updatedAccount = await account.save();

    return res.status(200).json({
      success: true,
      message: 'Thêm thành viên thành công',
      payload: updatedAccount,
    });
  } catch (error) {
    console.log('Lỗi:', error);
    return res.status(500).json({ error: 'Đã xảy ra lỗi khi thêm thành viên vào tài khoản' });
  }
};

export const getAll = async (req,res,next) => {
  try {
      let results = await Account.find()

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
  
      let found = await Account.findById(id)
  
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

export const getMe = async (req, res, next)=>{
  try {
    res.status(200).json({
      payload: req.user,
    });
  } catch (err) {
    res.sendStatus(500);
  }
};
export const updateProfileController = async (req, res, next)=>{
  try {
    const {email,password} = req.body;
    const account = await Account.findById(req.params._id)
    //password
    if(password && password.length <6){
      return res.json({error: 'Password is required and 6 character long'})
    };
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await Account.findByIdAndUpdate(req.user._id,{
      password: hashedPassword || account.password,
    },{new:true});
    res.status(200).send(
      {
        success: true,
        message: 'Profile updated successfuly',
        updatedUser,
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: 'Error while update profile',
      error
    })
  }
};