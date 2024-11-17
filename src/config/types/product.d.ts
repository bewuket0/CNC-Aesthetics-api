import {
  type QueryOptions,
  type UpdateQuery,
  type FilterQuery,
  type Document,
  type Types,
  type ProjectionType,
  ObjectExpressionOperatorReturningObject,
} from "mongoose";

// import { type Permission } from './permission'
import { type PermissionGroup } from "./permission_group";

/**
 * User type definitions
 *
 */

export interface IUser {
  _id?: Types.ObjectId;
  userCode: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  gender: "male" | "female";
  userRole: "admin" | "user";

  loginPassword?: string;
  passwordChangedAt?: Date;
  isEnabled?: boolean;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type User = IUser & Document;

export interface UserFilter extends FilterQuery<User> {}

export interface UserProjection extends ProjectionType<User> {}

export interface UserOptions extends QueryOptions<User> {}

export interface UserUpdate extends UpdateQuery<User> {}

export type UserCallback = (
  err: any,
  user:
    | (FlattenMaps<User> & {
        _id: Types.ObjectId;
      })
    | null
) => void;

export type UserCollectionCallback = (
  err: any,
  user:
    | Array<
        FlattenMaps<User> & {
          _id: Types.ObjectId;
        }
      >
    | []
) => void;

export type UserPaginatedCallBack = (
  err: any,
  result?: PaginateResult<any>
) => void;
