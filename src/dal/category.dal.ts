import {
  type LeanDocument,
  type PaginateResult,
  type PopulateOptions,
} from "mongoose";

import categoryModel from "../models/category.model";

import {
  type CategoryUpdate,
  type ICategory,
  type CategoryFilter,
  type CategoryOptions,
  type CategoryProjection,
} from "../config/types/category";

const whitelist = {};

const population: PopulateOptions[] = [
  // {
  //   path: "permissions",
  //   model: PermissionModel,
  //   select: {
  //     _id: 1,
  //     permissionName: 1,
  //   },
  // },
  // {
  //   path: "permissionGroup",
  //   model: PermissionGroupModel,
  //   select: {
  //     _id: 1,
  //     groupName: 1,
  //     permissions: 1,
  //   },
  //   populate: {
  //     path: "permissions",
  //     model: PermissionModel,
  //     select: {
  //       _id: 1,
  //       permissionName: 1,
  //     },
  //   },
  // },
];

interface CategoryDalParams {
  method:
    | "create"
    | "get"
    | "get collection"
    | "get paginate"
    | "update"
    | "delete";
  query?: CategoryFilter;
  projection?: CategoryProjection;
  options?: CategoryOptions;
  data?: ICategory;
  update?: CategoryUpdate;
}

interface CategoryReturn {
  statusCode: number;
  body: {
    error: unknown;
    data?:
      | ICategory
      | ICategory[]
      | PaginateResult<any>
      | (LeanDocument<any> & Required<{ _id: unknown }>);
  };
}

/**
 * CategoryDal function
 */
export async function categoryDal(
  props: CategoryDalParams
): Promise<CategoryReturn> {
  switch (props.method) {
    case "create": {
      const { data } = props;

      if (data != null) {
        return await createCategory(data);
      } else {
        return {
          statusCode: 400,
          body: {
            error: "no data provided",
          },
        };
      }
    }

    case "get": {
      const { query, projection, options } = props;

      return await getCategory(query ?? {}, projection, options);
    }

    case "get collection": {
      const { query, projection, options } = props;

      return await getCollection(query ?? {}, projection, options);
    }

    case "get paginate": {
      const { query, options } = props;

      return await getPaginate(query ?? {}, options);
    }

    case "update": {
      const { query, options, update } = props;

      if (query !== undefined || update !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return await updateCategory(query!, update!, options);
      }
      return {
        statusCode: 400,
        body: {
          error: "query or update not provided",
        },
      };
    }

    default: {
      return {
        statusCode: 500,
        body: {
          error: "Unknown database action",
        },
      };
    }
  }
}

export const FindSingleCategoryDal = async (query: any) => {
  try {
    const response = await categoryModel.findOne(query);
    if (response) {
      return response;
    }
    return false;
  } catch (error) {
    return false;
  }
};

async function createCategory(data: ICategory): Promise<CategoryReturn> {
  try {
    const category = (await categoryModel.create(data)).toObject();

    return {
      statusCode: 201,
      body: { error: null, data: category },
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: {
        error: err.message,
      },
    };
  }
}

async function getCategory(
  query: CategoryFilter,
  projection?: CategoryProjection,
  options?: CategoryOptions
): Promise<CategoryReturn> {
  try {
    const category = await categoryModel
      .findOne(query, projection ?? whitelist, options)
      .lean()
      .populate(population);

    if (category === null) {
      return {
        statusCode: 400,
        body: { error: "category not found" },
      };
    } else {
      return {
        statusCode: 200,
        body: { error: null, data: category },
      };
    }
  } catch (err: any) {
    return {
      statusCode: 500,
      body: {
        error: err.message,
      },
    };
  }
}

async function getCollection(
  query: CategoryFilter,
  projection?: CategoryProjection,
  options?: CategoryOptions
): Promise<CategoryReturn> {
  try {
    const categories = await categoryModel
      .find(query, projection ?? whitelist, options)
      .populate(population)
      .lean();

    return {
      statusCode: 200,
      body: {
        error: null,
        data: categories,
      },
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: {
        error: err.message,
      },
    };
  }
}

async function getPaginate(
  query: CategoryFilter,
  options?: CategoryOptions
): Promise<CategoryReturn> {
  const opts = {
    select: whitelist,
    sort: options != null ? options.sort : {},
    populate: population,
    lean: true,
    page: options != null ? Number(options.page) : 1,
    limit: options != null ? Number(options.limit) : 10,
  };

  try {
    const paginatedCategoryList = await categoryModel.paginate(query, opts);

    return {
      statusCode: 200,
      body: {
        error: null,
        data: paginatedCategoryList,
      },
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: {
        error: err.message,
      },
    };
  }
}

async function updateCategory(
  query: CategoryFilter,
  update: CategoryUpdate,
  options?: CategoryOptions
): Promise<CategoryReturn> {
  const opts = {
    new: true,
    select: whitelist,
    ...options,
  };

  try {
    const category = await categoryModel
      .findOneAndUpdate(query, update, opts)
      .populate(population)
      .lean();

    if (category != null) {
      return {
        statusCode: 200,
        body: {
          error: null,
          data: category,
        },
      };
    }

    return {
      statusCode: 400,
      body: { error: "error updating category" },
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: {
        error: err.message,
      },
    };
  }
}

export default categoryDal;
