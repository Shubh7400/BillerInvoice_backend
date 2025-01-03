import { Project } from "../schemas/project";
export class FileResponseDto {
    filename: string;
    url: string;
  }
  
  export class ProjectResponseDto {
    project: Project;
    updatedProject?: Partial<Project>;
    uploadedFiles: FileResponseDto[];
  }
  