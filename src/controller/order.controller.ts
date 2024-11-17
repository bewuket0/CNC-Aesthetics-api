import { create } from "domain";
import { Request, Response } from "express";
import { EventEmitter } from "stream";

const healthcheck = (req: Request, res: Response) => {
  res.status(200).json({
    success: "200 ok",
    message: "Server is up and running",
  });
};

const fetchAllOrders = (req: Request, res: Response) => {};
const fetchOrderDetail = (req: Request, res: Response) => {};
const createOrder = (req: Request, res: Response) => {};
const updateOrder = (req: Request, res: Response) => {};
const deleteOrder = (req: Request, res: Response) => {};

export default {
  healthcheck,
  fetchAllOrders,
  fetchOrderDetail,
  createOrder,
  updateOrder,
  deleteOrder,
};
