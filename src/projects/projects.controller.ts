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
  UploadedFiles
} from '@nestjs/common';
import { CreateProjectDto } from './dto/createproject.dto';
import { ProjectsService } from './projects.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdateProjectDto } from './dto/updateproject.dto';
import { CloudinaryService } from './cloudinaryService';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FileResponseDto,ProjectResponseDto } from './dto/fileupload.Dto';
import { FilesInterceptor } from '@nestjs/platform-express';


@Controller('projects')
export class ProjectsController {

  constructor(
    private readonly projectService: ProjectsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseGuards(AuthGuard())
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'files', maxCount: 10 }, // Accept up to 10 files
  ]))
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
    @UploadedFiles() files: { files?: Express.Multer.File[] },
  ): Promise<ProjectResponseDto> {
    let uploadedFiles: FileResponseDto[] = [];
    console.log('Received files while create:', files); // Log the files to debug

    if (files?.files?.length) {
      uploadedFiles = await Promise.all(
        files.files.map(async (file) => {
          const uploadResult = await this.cloudinaryService.uploadFile(file);
          return { filename: file.originalname, url: uploadResult.secure_url };
        }),
      );
    }
    const fileUrls = uploadedFiles.map(file => file.url);
    const project = await this.projectService.createProject({ ...createProjectDto, fileUrls });
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
    { name: 'files', maxCount: 10 }, // Accept up to 10 files
  ]))
async updateProjectById(
  @Param('id') id: string,
  @Body() updateProjectDto: UpdateProjectDto,
  @UploadedFiles() files: { files?: Express.Multer.File[] },
): Promise<ProjectResponseDto> {
  console.log(updateProjectDto,id,'Received files:', files); // Log the files to debug
  
  let newUploadedFiles: FileResponseDto[] = [];

  if (files?.files?.length) {
    newUploadedFiles = await Promise.all(
      files.files.map(async (file) => {
        const uploadResult = await this.cloudinaryService.uploadFile(file);
        return { filename: file.originalname, url: uploadResult.secure_url };
      }),
    );
    console.log("newUploadedFiles",newUploadedFiles)
  }
  
  const existingProject = await this.projectService.getProjectById(id);
  const allFileUrls = [
    ...(existingProject.fileUrls || []),
    ...newUploadedFiles.map(file => file.url),
  ];
  
  const updatedProjectData = { ...updateProjectDto, fileUrls: allFileUrls };
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
  @Get('/admin/:AdminId')
  @UseGuards(AuthGuard())
  getAllProjectsByAdmin(@Param('AdminId') AdminId: string) {
    return this.projectService.getAllProjectsByAdmin(AdminId);
  }
}
