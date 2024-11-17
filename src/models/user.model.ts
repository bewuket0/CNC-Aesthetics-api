import modules from "./imports/index";
import { type PaginateModel } from "mongoose";
import { type User } from "../config/types/user";

const Schema = modules.mongoose.Schema;

const UserSchema = new Schema<User>(
  {
    userCode: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    phoneNumber: { type: String },
    gender: { type: String, enum: ["male", "female"] },
    userRole: { type: String, enum: ["admin", "user"] },

    loginPassword: { type: String },
    passwordChangedAt: { type: Date },

    isEnabled: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// add mongoose-troop middleware to support pagination
UserSchema.plugin(modules.paginator);

// Pre-save middleware to update passwordChangedAt field
UserSchema.pre<User>("save", function preSaveMiddleware(next) {
  if (!this.isModified("loginPassword") || this.isNew) return next();

  this.passwordChangedAt = modules.moment().toDate();

  next();
});
const userModel = modules.mongoose.model<User, PaginateModel<User>>(
  "User",
  UserSchema
);

// Expose the User Model
export default userModel;
