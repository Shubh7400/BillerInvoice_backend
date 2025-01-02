import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinaryService';

@Module({
  providers: [CloudinaryService],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
