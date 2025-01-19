import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  Param,
  Get,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientDto } from './dto/createClientDto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateClientDto } from './dto/updateClientDto';

@Controller('client')
export class ClientController {
  constructor(private clientService: ClientService) {}
  @Post()
  @UseGuards(AuthGuard())
  async create(@Body() createClientDto: ClientDto, @Req() req) {
    return this.clientService.createClient(createClientDto, req.user);
  }
  @UseGuards(AuthGuard())
  @Get()
  async getAllClients(@Req() req) {
    return this.clientService.getAllClients(req.user);
  }
  @UseGuards(AuthGuard())
  @Get(':id')
  async getClientById(@Param('id') id: string) {
    return this.clientService.getClientById(id);
  }
  @UseGuards(AuthGuard())
  @Patch(':id')
  async updateById(
    @Param('id') id: string,
    @Body() updateDto: UpdateClientDto,
  ) {
    console.log(updateDto, ' <<<<<<<<<<<');
    return this.clientService.updateClientById(id, updateDto);
  }
  // @UseGuards(AuthGuard())
  // @Delete(':id')
  // async deleteById(@Param('id') id: string) {
  //   return this.clientService.DeleteClientById(id);
  // }

  @UseGuards(AuthGuard())
@Patch(':id/toggle-status')
async toggleStatusById(@Param('id') id: string) {
  return this.clientService.toggleClientStatusById(id);
}

@UseGuards(AuthGuard())
@Get()
async getClients(@Query('isActive') isActive?: string) {
  const filter = isActive ? { isActive } : {};
  return this.clientService.getClients(filter);
}



  @Delete(':id/email')
  async deleteEmail(
    @Param('id') id: string,
    @Body('email') email: string,
  ) {
    return this.clientService.deleteEmail(id, email);
  }
}
