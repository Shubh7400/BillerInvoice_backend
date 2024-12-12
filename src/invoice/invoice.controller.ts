import {
  Controller,
  Post,
  UseGuards,
  Get,
  Body,
  Param,
  Req,
  Query,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateInvoiceDto } from './dto/createInvoice.dto';
import { GetProjectsByYearAndMonthDto } from './dto/getProjectByMonth.dto';
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

  @Get('/projects-by-month')
  @UseGuards(AuthGuard())
  getProjectsByYearAndMonth(@Query() query: GetProjectsByYearAndMonthDto,
  @Req() req,
  ) {
    const { year, month } = query;

    console.log('Controller Year:', year, 'Month:', month); 
    return this.invoiceService.getProjectsByYearAndMonth(year, month,req.user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  getInvoiceById(@Param('id') id: string) {
    return this.invoiceService.getInvoiceById(id);
  }
}
