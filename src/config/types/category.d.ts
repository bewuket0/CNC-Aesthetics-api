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
 * Category type definitions
 *
 */

export interface ICategory {
  _id?: Types.ObjectId;
  categoryCode: string;
  categoryName: string;
  categoryImage: string;

  isEnabled?: boolean;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type Category = ICategory & Document;

export interface CategoryFilter extends FilterQuery<Category> {}

export interface CategoryProjection extends ProjectionType<Category> {}

export interface CategoryOptions extends QueryOptions<Category> {}

export interface CategoryUpdate extends UpdateQuery<Category> {}

export type CategoryCallback = (
  err: any,
  category:
    | (FlattenMaps<Category> & {
        _id: Types.ObjectId;
      })
    | null
) => void;

export type CategoryCollectionCallback = (
  err: any,
  category:
    | Array<
        FlattenMaps<Category> & {
          _id: Types.ObjectId;
        }
      >
    | []
) => void;

export type CategoryPaginatedCallBack = (
  err: any,
  result?: PaginateResult<any>
) => void;
