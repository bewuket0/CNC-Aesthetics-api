import { create } from "domain";
import { Request, Response } from "express";
import { EventEmitter } from "stream";

const healthcheck = (req: Request, res: Response) => {
  res.status(200).json({
    success: "200 ok",
    message: "Server is up and running",
  });
};

const fetchAllCarts = (req: Request, res: Response) => {};
const fetchCartDetail = (req: Request, res: Response) => {};
const createCart = (req: Request, res: Response) => {};
const updateCart = (req: Request, res: Response) => {};
const deleteCart = (req: Request, res: Response) => {};

export default {
  healthcheck,
  fetchAllCarts,
  fetchCartDetail,
  createCart,
  updateCart,
  deleteCart,
};
