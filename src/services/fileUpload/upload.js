import multer from "multer";
import { apiError } from "../../utils/apiError.js";

const fileUpload = () => {
  const storage = multer.diskStorage({});

  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new apiError("only image allowed", 401));
    }
  };

  const upload = multer({ storage, fileFilter });

  return upload;
};

export const uploadSingleFile = (fieldname) => fileUpload().single(fieldname);
export const uploadArrayOfFiles = (fieldname) =>
  fileUpload().array(fieldname, 10);
export const uploadFieldsOfFiles = (fields) => fileUpload().fields(fields);
