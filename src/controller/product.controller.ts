import { create } from "domain";
import { Request, Response } from "express";
import { EventEmitter } from "stream";

const healthcheck = (req: Request, res: Response) => {
  res.status(200).json({
    success: "200 ok",
    message: "Server is up and running",
  });
};

const fetchAllProducts = (req: Request, res: Response) => {};
const fetchProductDetail = (req: Request, res: Response) => {};
const createProduct = (req: Request, res: Response) => {};
const updateProduct = (req: Request, res: Response) => {};
const deleteProduct = (req: Request, res: Response) => {};

export default {
  healthcheck,
  fetchAllProducts,
  fetchProductDetail,
  createProduct,
  updateProduct,
  deleteProduct,
};
