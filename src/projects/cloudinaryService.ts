
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

@Injectable()
export class CloudinaryService {
  async uploadFile(file: Express.Multer.File): Promise<any> {
    console.log('Uploading file to Cloudinary:', file.originalname);

    const isPdf = file.mimetype === 'application/pdf';

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: isPdf ? 'raw' : 'auto',
          use_filename: true, // Optional: retain original filename
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            console.log('Cloudinary upload result:', result);

            // Adjust URL for inline viewing if the file is a PDF
            if (isPdf) {
              result.secure_url = result.secure_url.replace(
                '/upload/',
                '/upload/fl_attachment:false/'
              );
            }

            resolve(result);
          }
        }
      ).end(file.buffer);
    });
  }
}






