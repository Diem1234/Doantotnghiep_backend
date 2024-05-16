

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

}