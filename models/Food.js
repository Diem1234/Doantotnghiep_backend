import mongoose from "mongoose";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";



// Mongoose Datatypes:
// https://mongoosejs.com/docs/schematypes.html

// Validator
// https://mongoosejs.com/docs/validation.html#built-in-validators
const foodIngredientSchema = new mongoose.Schema({
    ingredientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ingredient",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
    }
})

// Schema
foodIngredientSchema.virtual("ingredient",{
    ref: "Ingredient",
    localField: "ingredientId",
    foreignField: "_id",
    justOne: true
})

foodIngredientSchema.set('toObject', { virtuals: true });
// Virtuals in JSON
foodIngredientSchema.set('toJSON', { virtuals: true });

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: [50, "Tên sản phẩm không được vượt quá 50 ký tự"],
    },
    description: {
      type: String,
      maxLength: [500, "Mô tả sản phẩm không được vượt quá 500 ký tự"],
    },
    price: {
      type: Number,
      required: [true, "Giá không được để trống"],
      min: 0,
      default: 0,
    },
    discount: { type: Number, min: 0, max: 75, default: 0 },
    // Reference to Category
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    photo: {
      type: String,
      require: true,
    },
    subphoto: {
      type: Array,
      default: [],
    },
    foodIngredient: [foodIngredientSchema],
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

foodSchema.virtual("discoutedPrice").get(function () {
  return (this.price * (100 - this.discount)) / 100;
});

// Virtual with Populate
foodSchema.virtual("category", {
  ref: "Category",
  localField: "categoryId",
  foreignField: "_id",
  justOne: true,
});


// Config
foodSchema.set("toJSON", { virtuals: true });
foodSchema.set("toObject", { virtuals: true });
//
foodSchema.plugin(mongooseLeanVirtuals);

export const Food = mongoose.model("Food", foodSchema);

