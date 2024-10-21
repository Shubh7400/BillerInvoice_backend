import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientDto } from './dto/createClientDto';
import { Client } from './schemas/clients';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/auth/schemas/user';
import { UpdateClientDto } from './dto/updateClientDto';

@Injectable()
export class ClientService {
  constructor(@InjectModel(Client.name) private clientModel: Model<Client>) {}
  async createClient(createClientDto: ClientDto, user: User) {
    const newClient = createClientDto.clientName.trim();
    if (newClient.length === 0) {
      throw new HttpException(
        'Enter a valid Client Name',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      createClientDto.clientName = newClient;
      try {
        const sameState: boolean =
          createClientDto.address.state === user.address.state;
        const data = Object.assign(
          createClientDto,
          { user: user._id },
          { sameState: sameState },
        );

        const newClient = await this.clientModel.create(data);

        return newClient;
      } catch (error) {
        throw new NotFoundException('Client with this name already exists');
      }
    }
  }
  async getAllClients(user: User) {
    try {
      const clients = await this.clientModel
        .find({ user: user._id })
        .sort({ clientName: 1 });
      return clients;
    } catch (error) {
      return error;
    }
  }
  async getClientById(id: string) {
    try {
      const client = await this.clientModel.findById(id);
      return client;
    } catch (error) {
      throw new NotFoundException('Client does not  exists');
    }
  }
  async updateClientById(id: string, updateClientDto: UpdateClientDto) {
    const newClient = updateClientDto.clientName.trim();
    if (newClient.length === 0) {
      throw new HttpException(
        'Enter a valid Client Name',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      updateClientDto.clientName = newClient;
      try {
        await this.clientModel.findByIdAndUpdate(id, updateClientDto);
        return 'client successfully updated';
      } catch (error) {
        throw new HttpException(
          'error in updating client',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
  async DeleteClientById(id: string) {
    try {
      await this.clientModel.findByIdAndDelete(id);
      return 'client successfully deleted';
    } catch (error) {
      throw new HttpException(
        'error in deleting client',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
