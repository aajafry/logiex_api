"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinaryController = void 0;
const cloudinary_1 = require("cloudinary");
exports.cloudinaryController = {
    delete: (async (req, res) => {
        const { publicId } = req.body;
        try {
            const response = await cloudinary_1.v2.uploader.destroy(publicId);
            res.json({
                message: "successfully deleted cloudinary image",
                response,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({
                    message: "server error during cloudinary image deletion",
                    error: error.message,
                });
            }
        }
    }),
};
