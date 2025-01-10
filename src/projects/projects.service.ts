import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from './schemas/project';
import { Model } from 'mongoose';
import { CreateProjectDto } from './dto/createproject.dto';
import { UpdateProjectDto } from './dto/updateproject.dto';
import { User } from 'src/auth/schemas/user';
import { Cloudinary } from '@cloudinary/url-gen';
import { Client } from 'src/client/schemas/clients';
import * as dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary'; // Correct import for cloudinary v2

dotenv.config();

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
    @InjectModel(Client.name) private clientModel: Model<Client>,
  ) { }

  // async createProject(createProjectDto: CreateProjectDto): Promise<Project> {
  //   const newProjectName = createProjectDto.projectName.trim();
  //   if (newProjectName.length === 0) {
  //     throw new HttpException(
  //       'Enter a valid Project Name',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   } else {
  //     createProjectDto.projectName = newProjectName;

  //     try {
  //       // Log the DTO to see uploadedFiles
  //       console.log("----", createProjectDto);

  //       if (this.calculateAmount(createProjectDto)) {
  //         const amount = this.calculateAmount(createProjectDto);
  //         const data = {
  //           ...createProjectDto,
  //           amount,
  //           advanceAmount: createProjectDto.advanceAmount || 0, // Default to 0 if not provided
  //         };

  //         console.log(data, ' <<<<<<<<<');
  //         return await this.projectModel.create(data);
  //       } else {
  //         const project = new this.projectModel({
  //           ...createProjectDto,
  //         });

  //         return project.save();
  //       }
  //     } catch (error) {
  //       throw new HttpException(
  //         'error in creating project',
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }
  //   }
  // }

  async createProject(createProjectDto: CreateProjectDto): Promise<Project> {
    const newProjectName = createProjectDto.projectName.trim();
    if (newProjectName.length === 0) {
        throw new HttpException(
            'Enter a valid Project Name',
            HttpStatus.BAD_REQUEST,
        );
    } else {
        createProjectDto.projectName = newProjectName;

        try {
            console.log("----", createProjectDto);

            // Step 1: Fetch client details
            const client = await this.clientModel.findById(createProjectDto.clientId);
            if (!client) {
                throw new Error('Client not found');
            }

            // Step 2: Add clientDetails to the project data
            const clientDetails = {
                clientName: client.clientName,
                contactNo: client.contactNo,
                gistin: client.gistin,
                pancardNo: client.pancardNo,
                address: client.address,
                email: client.email,
            };

            if (this.calculateAmount(createProjectDto)) {
                const amount = this.calculateAmount(createProjectDto);
                const data = {
                    ...createProjectDto,
                    amount,
                    advanceAmount: createProjectDto.advanceAmount || 0, // Default to 0 if not provided
                    clientDetails, // Include the clientDetails here
                };

                console.log(data, ' <<<<<<<<<');
                return await this.projectModel.create(data);
            } else {
                const project = new this.projectModel({
                    ...createProjectDto,
                    clientDetails, // Include the clientDetails here
                });

                return project.save();
            }
        } catch (error) {
            throw new HttpException(
                'Error in creating project',
                HttpStatus.BAD_REQUEST,
            );
        }
    }
}


  async getAllProjects(id: string) {
    try {
      const projects = await this.projectModel.find({ clientId: id });
      return projects;
    } catch (error) {
      return error;
    }
  }
  //  original getProjectById function 
  // async getProjectById(id: string) {
  //   try {
  //     const project = await this.projectModel.findById(id);
  //     return project;
  //   } catch (error) {
  //     throw new NotFoundException('Project does not exists');
  //   }
  // }

  // modified getProjectById for converting pdf  to image
  async getProjectById(id: string) {
    try {
      const project = await this.projectModel.findById(id);
      if (!project) {
        throw new NotFoundException('Project does not exist');
      }

      // Transform uploaded files (e.g., PDFs) to include image URLs and retain original file URLs
      if (project.uploadedFiles && Array.isArray(project.uploadedFiles)) {
        const cloudinary = new Cloudinary({
          cloud: {
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
          },
        });

        project.uploadedFiles = project.uploadedFiles.map((file) => {
          const publicId = file.url.split('/').pop()?.split('.')[0]; // Extract publicId from URL

          // Generate image URL for the PDF
          const imageUrl = cloudinary
            .image(publicId)
            .format('jpg') // Convert PDF to JPG
            .toURL();

          return { 
            filename: file.filename,
            imageUrl,                // Transformed image URL
            url: file.url,           // Original file URL for download
          };
        });
      }

      return project;
    } catch (error) {
      throw new NotFoundException('Project does not exist');
    }
  }



  async updateProjectById(id: string, updateProjectDto: UpdateProjectDto) {
    if (updateProjectDto.projectName) {
      console.log(updateProjectDto.projectName);
      const newProjectName = updateProjectDto.projectName.trim();
      if (newProjectName.length === 0) {
        throw new HttpException(
          'Enter a valid Project Name',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        updateProjectDto.projectName = newProjectName;
      }
    }

    try {
      if (this.calculateAmount(updateProjectDto)) {
        const amount = this.calculateAmount(updateProjectDto);
        console.log(amount);
        const data = {
          ...updateProjectDto,
          amount,
          advanceAmount: updateProjectDto.advanceAmount || 0, // Default to 0 if not provided

        };
        console.log({ data });
        await this.projectModel.findByIdAndUpdate(id, data);
        return 'successfully updated';
      } else {
        await this.projectModel.findByIdAndUpdate(id, updateProjectDto);
        return 'successfully updated';
      }
    } catch (error) {
      throw new HttpException(
        'error in updating project',
        HttpStatus.BAD_REQUEST,
      );
    }
  }



  async deleteProjectById(id: string) {
    try {
      await this.projectModel.findByIdAndDelete(id);
      return 'successfully deleted';
    } catch (error) {
      throw new HttpException(
        'error in deleting project',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  calculateAmount(dto: any): number | null {
    const {
      rate,
      workingPeriod,
      workingPeriodType,
      projectPeriod,
      ratePerDay,
      conversionRate,
    } = dto;
    console.log(workingPeriod);
    if (workingPeriodType === 'hours') {
      if (rate && workingPeriod && conversionRate) {
        const [hours, minutes] = workingPeriod.split(':');
        const totalHours = parseFloat(hours) + parseFloat(minutes) / 60;
        const amount = rate * totalHours * conversionRate;

        // Use toFixed to limit to 2 decimal places
        return parseFloat(amount.toFixed(2));
      } else {
        return null;
      }
    } else if (workingPeriodType === 'months') {
      if (rate && workingPeriod && conversionRate && projectPeriod) {
        const amount =
          (rate / projectPeriod) * ratePerDay * parseFloat(workingPeriod) * conversionRate;
        return +amount.toFixed(2);
      } else {
        return null;
      }
    }
  }
  async getAllProjectsByAdmin(userId: string) {
    const projects = await this.projectModel.find({ adminId: userId });
    return projects;
  }
}
