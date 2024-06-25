
import axios from "axios";
import { hashPassword } from "../helpers/authHelper.js";
import { generateRefreshToken, generateToken } from "../helpers/jwtHelper.js";
import { Account } from "../models/Account.js";
import { Food } from "../models/Food.js";
import https from 'https';

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
export const memberSearch = async (req, res, next) => {
  try {
    const { name } = req.query;
    const conditionFind = {
      'familyMembers.name': { $regex: new RegExp(`${name || ''}`, 'i') }
    };

    const results = await Account.find(conditionFind, {
      _id: 1,
      'familyMembers': {
        $filter: {
          input: '$familyMembers',
          as: 'member',
          cond: { $regexMatch: { $toString: '$$member.name' }, $regex: new RegExp(`${name || ''}`, 'i') }
        }
      }
    })
    .lean();

    res.send({ code: 200, payload: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred' });
  }
};
export const memberStatusFilter = async (req, res, next) => {
  try {
    const { status } = req.query;

    const accounts = await Account.find({
      'familyMembers.status': status
    }, {
      'familyMembers.$': 1
    });

    const membersWithStatus = accounts.flatMap(account => account.familyMembers.filter(member => member.status === status));
    const membersWithStatusCount = membersWithStatus.length;

    res.send({ code: 200, count: membersWithStatusCount, payload: membersWithStatus });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const memberStatusTwo = async (req, res, next) => {
  try {
    const accounts = await Account.find({
      'familyMembers.status': { $ne: 'Bình Thường' }
    }, {
      'familyMembers.$': 1
    });

    const membersWithAbnormalStatus = accounts.flatMap(account => account.familyMembers.filter(member => member.status !== 'Bình Thường'));

    res.json(membersWithAbnormalStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//delete member
export const deleteFamilyMember = async (req, res) => {
  try {
    const { accountId, familyMemberId } = req.params;

    // Find the account
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Find the family member in the account
    const familyMember = account.familyMembers.id(familyMemberId);
    if (!familyMember) {
      return res.status(404).json({ message: 'Family member not found' });
    }

    // Remove the family member from the account
    account.familyMembers.pull(familyMember);
    await account.save();

    return res.status(200).json({ message: 'Family member deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while deleting the family member' });
  }
};
export const updateFamilyMember = async (req, res) => {
  try {
    const { accountId, familyMemberId } = req.params;
    const { name, gender, status, age, trend, phone } = req.body;

    // Tìm account
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ message: 'Không tìm thấy account' });
    }

    // Tìm vị trí của family member trong mảng familyMembers
    const index = account.familyMembers.findIndex(member => member._id.toString() === familyMemberId);
    if (index === -1) {
      return res.status(404).json({ message: 'Không tìm thấy family member' });
    }

    // Update thông tin của family member
    account.familyMembers[index].name = name;
    account.familyMembers[index].gender = gender;
    account.familyMembers[index].status = status;
    account.familyMembers[index].age = age;
    account.familyMembers[index].trend = trend;
    account.familyMembers[index].phone = phone;

    // Lưu lại account
    const updatedAccount = await account.save();

    return res.status(200).json({ message: 'Cập nhật family member thành công',payload: account.familyMembers[index]});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật family member' });
  }
};

export const getSuggest = async (req, res, next) => {
  try {
    const { accountId, familyMemberId } = req.params;

    // Tìm account
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ message: 'Không tìm thấy account' });
    }
    
    // Tìm vị trí của family member trong mảng familyMembers
    const index = account.familyMembers.findIndex(member => member._id.toString() === familyMemberId);
    if (index === -1) {
      return res.status(404).json({ message: 'Không tìm thấy family member' });
    }
    
    // Truy xuất thông tin của thành viên gia đình
    const familyMember = account.familyMembers[index];
    
    const apiParams = {
      tinhtrang: familyMember.status,
      gioitinh: familyMember.gender,
      xuhuong: familyMember.trend
    };
    const apiResponse = await axios.get('https://localhost:44327/api/Service', { params: apiParams, httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })}
      
      // Bỏ qua xác minh SSL nếu cần thiết (không khuyến khích cho môi trường sản xuất)
      
    );
    const data = apiResponse.data;
    console.log('API response data:', apiResponse.data);
    // Lấy danh sách món ăn khớp
    // Kiểm tra xem data có phải là một mảng hay không
let dishIds;
if (Array.isArray(data)) {
  dishIds = data;
} else {
  dishIds = [data];
}

// Tìm các món ăn khớp
const matchedDishes = await Food.find({
  _id: { $in: dishIds }
});
    
    res.status(200).json({
      success: true,
      payload: matchedDishes
    });
  } catch (error) {
    console.error('Error calling API:', error.message);
    return res.status(500).json({ message: 'Đã xảy ra lỗi khi call api' });
  }
};


