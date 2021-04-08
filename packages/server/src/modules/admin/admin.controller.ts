import { Controller, Get, Param, Query, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from './admin.guard';
import { AdminService } from './admin.service';

///+api-admin-controller-import

@ApiTags('Admin')
@Controller('api/admin')
export class AdminController {

  constructor(private readonly adminService: AdminService) { }

///+api-admin-controller

@UseGuards(AdminGuard)
@Get('sample')
 @ApiOperation({ summary: 'Sample API end-point' })
 async sample(@Query('greeting') greeting: string): Promise<string> {
   return await this.adminService.sample(greeting);
 }
  
}
