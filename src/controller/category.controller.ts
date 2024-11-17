import { create } from "domain";
import { Request, Response } from "express";
import { EventEmitter } from "stream";
import validate_body from "../lib/validate_body";
import { categorySchema } from "../config/schema/category.schema";
import categoryDal from "../dal/category.dal";

const healthcheck = (req: Request, res: Response) => {
  res.status(200).json({
    success: "200 ok",
    message: "Server is up and running",
  });
};

const fetchAllCategories = (req: Request, res: Response) => {};
const fetchCategoryDetail = (req: Request, res: Response) => {};
const createCategory = (req: Request, res: Response) => {
  const workflow = new EventEmitter();
  const _payload = req.body;
  let validated_data: any;
  let returndata = { statusCode: 400, data: {}, error: "" };
  return new Promise((resovle) => {
    workflow.on("validate", () => {
      const { statusCode, body } = validate_body(_payload, categorySchema);
      if (statusCode !== 200) {
        return res.status(400).json(body);
      }
      validated_data = body.data;
      workflow.emit("checkcategoryexist");
    });
    workflow.on("checkcategoryexist", async () => {
      const query = {
        name: validated_data.name,
        isDeleted: false,
      };

      const { statusCode, body } = await categoryDal({ method: "get", query });
      if (statusCode == 200) {
        return res.status(400).json({
          ...returndata,
          error: "Category already exist",
        });
      } else if (statusCode == 400) {
        workflow.emit("uplaodimage");
      } else {
        return res.status(500).json({
          ...returndata,
          error: "something went wrong",
        });
      }
    });
    workflow.on("uploadimage", async () => {});
    workflow.on("create", async () => {});
    workflow.emit("validate");
  });
};
const updateCategory = (req: Request, res: Response) => {};
const deleteCategory = (req: Request, res: Response) => {};

export default {
  healthcheck,
  fetchAllCategories,
  fetchCategoryDetail,
  createCategory,
  updateCategory,
  deleteCategory,
};
