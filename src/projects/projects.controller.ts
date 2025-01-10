import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/createproject.dto';
import { ProjectsService } from './projects.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdateProjectDto } from './dto/updateproject.dto';
import { CloudinaryService } from './cloudinaryService';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FileResponseDto, ProjectResponseDto } from './dto/fileupload.Dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Project } from 'src/projects/schemas/project';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';

@Controller('projects')
export class ProjectsController {

  constructor(
    private readonly projectService: ProjectsService,
    private readonly cloudinaryService: CloudinaryService,
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
  ) { }

  @Post()
  @UseGuards(AuthGuard())
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'files', maxCount: 10 },
  ]))
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
    @UploadedFiles() files: { files?: Express.Multer.File[] },
  ): Promise<ProjectResponseDto> {
    let uploadedFiles: FileResponseDto[] = [];

    console.log('Received files while create:', files);

    if (files?.files?.length) {
      uploadedFiles = await Promise.all(
        files.files.map(async (file) => {
          const uploadResult = await this.cloudinaryService.uploadFile(file);
          return { filename: file.originalname, url: uploadResult.url };
        }),
      );
    }

    const projectData = {
      ...createProjectDto,
      uploadedFiles,
    };

    const project = await this.projectService.createProject(projectData);


    return { project, uploadedFiles };
  }

  @Get('/client/:id')
  @UseGuards(AuthGuard())
  getAllProjects(@Param('id') id: string) {
    return this.projectService.getAllProjects(id);
  }
  @Get(':id')
  @UseGuards(AuthGuard())
  getProjectById(@Param('id') id: string) {
    return this.projectService.getProjectById(id);
  }

  @Patch(':id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'files', maxCount: 10 },
  ]))
  async updateProjectById(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @UploadedFiles() files: { files?: Express.Multer.File[] },
  ): Promise<ProjectResponseDto> {
    console.log(updateProjectDto, id, 'Received files:', files);

    let newUploadedFiles: FileResponseDto[] = [];

    if (files?.files?.length) {
      newUploadedFiles = await Promise.all(
        files.files.map(async (file) => {
          const uploadResult = await this.cloudinaryService.uploadFile(file);
          return { filename: file.originalname, url: uploadResult.url };
        }),
      );
      console.log("newUploadedFiles", newUploadedFiles);
    }

    const existingProject = await this.projectService.getProjectById(id);

    const combinedUploadedFiles = [
      ...(existingProject.uploadedFiles || []),
      ...newUploadedFiles,
    ];

    const updatedProjectData = {
      ...updateProjectDto,
      uploadedFiles: combinedUploadedFiles,
    };

    await this.projectService.updateProjectById(id, updatedProjectData);
    const updatedProject = await this.projectService.getProjectById(id);

    return {
      project: updatedProject,
      uploadedFiles: newUploadedFiles,
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  deleteProjectById(@Param('id') id: string) {
    return this.projectService.deleteProjectById(id);
  }
  @Delete(':id/file')
  @UseGuards(AuthGuard())
  async deleteFileFromProject(
    @Param('id') projectId: string,
    @Body('filename') filename: string,
  ) {
    return this.projectService.deleteFileFromProject(projectId, filename);
  }
  @Get('/admin/:AdminId')
  @UseGuards(AuthGuard())
  getAllProjectsByAdmin(@Param('AdminId') AdminId: string) {
    return this.projectService.getAllProjectsByAdmin(AdminId);
  }
}
