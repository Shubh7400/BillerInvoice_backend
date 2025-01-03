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
  HttpStatus
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

  // Add uploaded files directly to the project schema
  const projectData = {
    ...createProjectDto,
    uploadedFiles, // Attach the uploaded files directly here
  };

  const project = await this.projectService.createProject(projectData);

  // Return the project with the uploadedFiles inside the project object
  return { project, uploadedFiles }; // Ensure uploadedFiles is included in the response
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
    console.log(updateProjectDto, id, 'Received files:', files); // Log the files to debug
    
    let newUploadedFiles: FileResponseDto[] = [];
  
    // Process new uploaded files
    if (files?.files?.length) {
      newUploadedFiles = await Promise.all(
        files.files.map(async (file) => {
          const uploadResult = await this.cloudinaryService.uploadFile(file);
          return { filename: file.originalname, url: uploadResult.secure_url };
        }),
      );
      console.log("newUploadedFiles", newUploadedFiles);
    }
  
    // Retrieve the existing project
    const existingProject = await this.projectService.getProjectById(id);
  
    // Combine existing uploaded files with new uploaded files
    const combinedUploadedFiles = [
      ...(existingProject.uploadedFiles || []), // Existing files
      ...newUploadedFiles, // New uploaded files
    ];
  
    // Update project data with combined uploadedFiles
    const updatedProjectData = { 
      ...updateProjectDto, 
      uploadedFiles: combinedUploadedFiles, // Only uploadedFiles are updated
    };
  
    await this.projectService.updateProjectById(id, updatedProjectData);
  
    // Fetch updated project details
    const updatedProject = await this.projectService.getProjectById(id);
  
    return {
      project: updatedProject, // Full project object
      uploadedFiles: newUploadedFiles, // Only new files are returned here for the response
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
