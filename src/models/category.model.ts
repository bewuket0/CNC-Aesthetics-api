import modules from "./imports/index";
import { type PaginateModel } from "mongoose";
import { type Category } from "../config/types/category";

const Schema = modules.mongoose.Schema;

const CategorySchema = new Schema<Category>(
  {
    categoryCode: { type: String },
    categoryName: { type: String },
    categoryImage: { type: String },

    isEnabled: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// add mongoose-troop middleware to support pagination
CategorySchema.plugin(modules.paginator);

const CategoryModel = modules.mongoose.model<Category, PaginateModel<Category>>(
  "Category",
  CategorySchema
);

// Expose the Category Model
export default CategoryModel;
