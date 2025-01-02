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
  ) {
    let fileUrls: string[] = [];

    if (files?.files?.length) {
      fileUrls = await Promise.all(
        files.files.map(file => this.cloudinaryService.uploadFile(file).then(res => res.secure_url)),
      );
    }
    // Attach file URLs to DTO
    return this.projectService.createProject({ ...createProjectDto, fileUrls });
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
@UseGuards(AuthGuard())
@UseInterceptors(FileFieldsInterceptor([
  { name: 'files', maxCount: 10 }, // Accept up to 10 files
]))
async updateProjectById(
  @Param('id') id: string,
  @Body() updateProjectDto: UpdateProjectDto,
  @UploadedFiles() files: { files?: Express.Multer.File[] },
) {
  let newFileUrls: string[] = [];

  
  if (files?.files?.length) {
    newFileUrls = await Promise.all(
      files.files.map(file => this.cloudinaryService.uploadFile(file).then(res => res.secure_url)),
    );
  }

  
  const existingProject = await this.projectService.getProjectById(id);
  const existingFileUrls = existingProject.fileUrls || [];

  
  const allFileUrls = [...existingFileUrls, ...newFileUrls];

  
  const updatedProjectData = {
    ...updateProjectDto,
    fileUrls: allFileUrls, 
  };

  
  return this.projectService.updateProjectById(id, updatedProjectData);
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
