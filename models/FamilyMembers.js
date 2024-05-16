
import mongoose from 'mongoose';

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
export const FamilyMember = mongoose.model('FamilyMember', familyMemberSchema);