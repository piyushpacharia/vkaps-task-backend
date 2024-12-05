
import cryptoRandomString from "crypto-random-string";
import multer from "multer";
import path from "path";
import fs from "fs";
 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { fileCategory } = req.params; 
    const uploadPath = fileCategory ? path.join("uploads", fileCategory) : "uploads";

    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = cryptoRandomString({ length: 10, type: "alphanumeric" });
    const fileExtension = path.extname(file.originalname);
    cb(null, `${uniqueName}${fileExtension}`);
  },
});

const fileExtensionFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else { 
    cb(
      new multer.MulterError(
        "LIMIT_UNEXPECTED_FILE",
        "Only  JPG, PNG, JPEG, and WEBP files are allowed!"
      )
    );
  }
};

const imgUpload = multer({
  storage,
  fileFilter: fileExtensionFilter,
  limits: { fileSize: 1024 * 1024 * 10 },
}).fields([
  { name: "productImage", maxCount: 1 },
]);

export const uploadFile = (req, res, next) => {
  imgUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) { 
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ success: false, message: "File size exceeds the limit of 10MB." });
      }
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json({ success: false, message: err.message });
      }
      return res.status(400).json({ success: false, message: `Multer error: ${err.message}` });
    } else if (err) { 
      return res.status(500).json({ success: false, message: "An error occurred during the file upload." });
    }
    next();
  });
};
