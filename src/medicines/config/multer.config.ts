import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

// Allowed image file types
const allowedImageTypes = /jpeg|jpg|png|gif|webp|jfif|svg/;

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads/medicines',
    filename: (req, file, callback) => {
      const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
      callback(null, uniqueName);
    },
  }),
  fileFilter: (req, file, callback) => {
    const ext = extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;

    if (!allowedImageTypes.test(ext) || !allowedImageTypes.test(mimetype)) {
      return callback(
        new BadRequestException(
          'Only image files (jpeg, jpg, png, gif, webp, jfif) are allowed!',
        ),
        false,
      );
    }
    callback(null, true);
  },
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB max file size
  },
};
