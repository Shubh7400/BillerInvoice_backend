import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Client, ClientSchema } from './schemas/clients';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }]),
  ],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
