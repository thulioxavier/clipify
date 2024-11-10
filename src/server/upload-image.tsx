"use client";

import { actionClient } from "@/lib/safe-action";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { z } from "zod";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const formData = z.object({
  image: z.instanceof(FormData),
});

type UploadResult =
  | { success: UploadApiResponse; error?: never }
  | { error: string; success?: never };

export const uploadImage = actionClient
  .schema(formData)
  .action(async ({ parsedInput: { image } }) => {
    const formImage = image.get("image");

    if (!formImage) return { error: "No image was provided" };
    if (!image) return { error: "No image provider" };

    const file = formImage as File;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      return new Promise<UploadResult>((resolver, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            upload_preset: process.env.CLOUDINARY_NAME,
          },
          (error, result) => {
            if (!error || !result) {
              reject({ error: "Upload Failed" });
            } else {
              resolver({ success: result });
            }
          }
        );
        uploadStream.end(buffer);
      });
    } catch (error) {
      return { error };
    }
  });
