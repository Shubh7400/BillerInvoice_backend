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

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
  ) {}
  async createProject(createProjectDto: CreateProjectDto): Promise<Project> {
    const newProjectName = createProjectDto.projectName.trim();
    if (newProjectName.length === 0) {
      throw new HttpException(
        'Enter a valid Project Name',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      console.log(createProjectDto.projectName === newProjectName);
      createProjectDto.projectName = newProjectName;
      try {
        console.log(createProjectDto);
        if (this.calculateAmount(createProjectDto)) {
          const amount = this.calculateAmount(createProjectDto);
          const data = {
            ...createProjectDto,
            amount,
          };
          return await this.projectModel.create(data);
        } else {
          const project = new this.projectModel({
            ...createProjectDto,
          });

          return project.save();
        }
      } catch (error) {
        throw new HttpException(
          'error in creating project',
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
  async getProjectById(id: string) {
    try {
      const project = await this.projectModel.findById(id);
      return project;
    } catch (error) {
      throw new NotFoundException('Project does not exists');
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
    } else if (workingPeriodType === 'days') {
      if (rate && workingPeriod && conversionRate && projectPeriod) {
        const amount =
          (rate / projectPeriod) * parseFloat(workingPeriod) * conversionRate;
        return +amount.toFixed(2);
      } else {
        return null;
      }
    }
  }
  async getAllProjectsByAdmin(user: User) {
    const projects = await this.projectModel.find({ adminId: user._id });
    return projects;
  }
}
