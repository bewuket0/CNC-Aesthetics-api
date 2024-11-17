import { create } from "domain";
import { Request, Response } from "express";
import { EventEmitter } from "stream";

const healthcheck = (req: Request, res: Response) => {
  res.status(200).json({
    success: "200 ok",
    message: "Server is up and running",
  });
};

const fetchAllAdBanners = (req: Request, res: Response) => {};
const fetchAdBannerDetail = (req: Request, res: Response) => {};
const createAdBanner = (req: Request, res: Response) => {};
const updateAdBanner = (req: Request, res: Response) => {};
const deleteAdBanner = (req: Request, res: Response) => {};

export default {
  healthcheck,
  fetchAllAdBanners,
  fetchAdBannerDetail,
  createAdBanner,
  updateAdBanner,
  deleteAdBanner,
};
