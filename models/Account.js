import mongoose from "mongoose";
import bcrypt from "bcrypt";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";

const familyMemberSchema = new mongoose.Schema(
  {
  // ...
    name: {
      type: String,
      required: [true, 'Tên không được bỏ trống'],  
    },
    gender: {
      type: String,
      enum: ['Nam', 'Nữ'],
      required: [true, 'Giới tính không được bỏ trống'],
    },
    status: {
      type: String,
      required: [true, 'Trạng thái không được bỏ trống'],
    },
    age: {
      type: Number,
      required: [true, 'Tuổi không được bỏ trống'],
    },
    trend: {
      type: String,
      enum: ['Giảm cân', 'Tăng cân', 'Bình thường','Giữ cân'],
      default: 'Bình thường',
    },
    phone: {
      type: String,
      maxLength: [50, "Số điện thoại không được vượt quá 50 ký tự"],
      validate: {
        validator: function (value) {
          const phoneRegex =
            /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
          return phoneRegex.test(value);
        },
        message: `{VALUE} is not a valid phone!`,
      },
    }
  },
  {
    versionKey: false,
    timestamps: true,

  }
);

const accountSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email không được bỏ trống'],
      unique: true,
      maxLength: [50, 'Email không được vượt quá 50 ký tự'],
      validate: {
        validator: function (value) {
          const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
          return emailRegex.test(value);
        },
        message: '{VALUE} không phải là một địa chỉ email hợp lệ',
      },
    },
    password: {
      type: String,
      required: [true, 'Mật khẩu không được bỏ trống'],
      minLength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
    },
    familyMembers: [familyMemberSchema],
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

accountSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  } catch (error) {
    next(error);
  }
});
accountSchema.methods.isValidPass = async function (pass) {
  try {
    return await bcrypt.compare(pass, this.password);
  } catch (err) {
    throw new Error(err);
  }
};

// Config
accountSchema.set("toJSON", { virtuals: true });
accountSchema.set("toObject", { virtuals: true });
//
accountSchema.plugin(mongooseLeanVirtuals);

export const Account =  mongoose.model("Account", accountSchema);