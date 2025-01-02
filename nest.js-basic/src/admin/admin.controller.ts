import { Controller, Post, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { LoginAdminDto } from './validations/login.admin.validator';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Post('login')
  async login(@Body() loginAdminDto: LoginAdminDto) {
    const { email, password } = loginAdminDto;
    return this.adminService.login(email, password);
  }
}