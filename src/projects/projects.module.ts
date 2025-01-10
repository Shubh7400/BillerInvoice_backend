import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { ClientModule } from 'src/client/client.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './schemas/project';
import { AuthModule } from 'src/auth/auth.module';
import { User, UserSchema } from 'src/auth/schemas/user';
import { CloudinaryModule } from './cloudinaryModule';
import { Client,ClientSchema } from 'src/client/schemas/clients';
Client

@Module({
  imports: [
    ClientModule,
    AuthModule,
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }]),
    CloudinaryModule, // Add CloudinaryModule here
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
