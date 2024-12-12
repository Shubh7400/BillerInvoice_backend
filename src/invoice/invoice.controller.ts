import {
  Controller,
  Post,
  UseGuards,
  Get,
  Patch,
  Body,
  Param,
  Req,
  Query,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateInvoiceDto } from './dto/createInvoice.dto';
import { UpdateInvoiceDto } from './dto/updateInvoice.dto';
@Controller('invoice')
export class InvoiceController {
  constructor(private invoiceService: InvoiceService) { }
  @Post()
  @UseGuards(AuthGuard())
  createInvoice(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoiceService.createInvoice(createInvoiceDto);
  }
  @Get()
  @UseGuards(AuthGuard())
  getAllInvoices(@Req() req) {
    return this.invoiceService.getAllInvoices(req.user);
  }
  @Get('/monthly-count')
  @UseGuards(AuthGuard())
  getInvoiceCountByYear(@Query('year') year: string, @Query('user') user: string) {
    return this.invoiceService.getInvoiceCountByYear(year, user);
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  getInvoiceById(@Param('id') id: string) {
    return this.invoiceService.getInvoiceById(id);
  }


  @Patch(':id') // Route to handle updates
  @UseGuards(AuthGuard())
  updateInvoice(
    @Param('id') id: string,
    @Body() updateInvoiceDto: Partial<CreateInvoiceDto>
  ) {
    return this.invoiceService.updateInvoice(id, updateInvoiceDto);
  }
}

