import mongoose from "mongoose";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";
import { Account } from "./Account.js";
const memberFoodDetailSchema = new mongoose.Schema({
    familyMemberId: {
        type: mongoose.Schema.Types.ObjectId,
        // ref: 'Account.familyMembers',
      },
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
    // Thêm các trường khác liên quan đến memberFood
  });
  
  memberFoodDetailSchema.virtual('familyMember', {
    ref: 'Account.familyMembers',
    localField: 'familyMemberId',
    foreignField: '_id',
    justOne: true,
  });
  
  memberFoodDetailSchema.virtual('food', {
    ref: 'Food',
    localField: 'foodId',
    foreignField: '_id',
    justOne: true
  });
  memberFoodDetailSchema.set('toObject', { virtuals: true });
  // Virtuals in JSON
  memberFoodDetailSchema.set('toJSON', { virtuals: true });
const memberFoodSchema = new mongoose.Schema(
    {
      totalPrice: {
        type: Number,
        required: [true, "Giá không được để trống"],
        min: 0,
        default: 0,
      },
      memberFoodDetail: [memberFoodDetailSchema],
      // 0: Ẩn, 1: Hiện
      isDelete: {
        type: Boolean,
        default: false,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );
  memberFoodSchema.virtual("totalPriceFromFood", {
    ref: "Food",
    localField: "memberFoodDetail.foodId",
    foreignField: "_id",
    justOne: false,
    pipeline: [
      { $group: { _id: null, totalPrice: { $sum: "$price" } } }
    ],
    options: { allowDiskUse: true }
  });
// Config
memberFoodSchema.set("toJSON", { virtuals: true });
memberFoodSchema.set("toObject", { virtuals: true });
//
memberFoodSchema.plugin(mongooseLeanVirtuals);

export const Food = mongoose.model("MemberFood", foodSchema);

