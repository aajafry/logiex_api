import { v2 as cloudinary } from "cloudinary";
import {Request, Response, RequestHandler} from "express";

export const cloudinaryController = {
  delete: (async (req: Request, res: Response) => {
    const { publicId } = req.body;
    try {
      const response = await cloudinary.uploader.destroy(publicId);
      res.json({
        message: "successfully deleted cloudinary image",
        response,
      });
    } catch (error) {
      if(error instanceof Error) {
        res.status(500).json({
          message: "server error during cloudinary image deletion",
          error: error.message,
        });
      }
    }
  }) as RequestHandler,
};
