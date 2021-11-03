import multer from "multer";
import { v4 as uuidv4 } from "uuid";

export const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    let extension = file.originalname.split(".").pop();
    cb(null, uuidv4() + "." + extension);
  },
});

export const fileFilter = (req, file, cb) => {
  if (file.fieldname === "user_image") {
    if (file.mimetype.includes("image/")) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  } else {
    cb(null, false);
  }
};