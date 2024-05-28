import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên danh mục không được bỏ trống'],
      maxLength: [50, 'Tên danh mục không được vượt quá 50 ký tự'],
      unique: [true, 'Tên danh mục không được trùng'],
    },
    isDelete: {
      type: Boolean,
      default: false,
      required: true,
    },
    photo: {
      type: String,
      require: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const Category = mongoose.model('Category', categorySchema);
