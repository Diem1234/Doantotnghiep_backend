import mongoose from "mongoose";

import mongooseLeanVirtuals from "mongoose-lean-virtuals";

const ingredientSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    date_add: {
        type: Date,
        require: true,
        default: Date.now
    },
    // Reference to Supplier
    supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supplier",
        required: true,
      },
});

ingredientSchema.virtual("supplier", {
    ref: "Supplier",
    localField: "supplierId",
    foreignField: "_id",
    justOne: true,
  });

// Config
ingredientSchema.set("toJSON", { virtuals: true });
ingredientSchema.set("toObject", { virtuals: true });
//
ingredientSchema.plugin(mongooseLeanVirtuals);

export const Ingredient = mongoose.model("Ingredient", ingredientSchema);