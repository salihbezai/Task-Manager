import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "profile-images",         // folder in Cloudinary
      public_id: `${file.fieldname}-${Date.now()}`, // optional custom filename
      format: file.mimetype.split("/")[1], // jpg, png, etc
    };
  },
});

const upload = multer({ storage });

export default upload;