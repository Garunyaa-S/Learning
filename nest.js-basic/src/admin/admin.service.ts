import { Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from './models/admin.model';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService implements OnModuleInit {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private sessionService: SessionService
  ) { }

  async onModuleInit() {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');

    // Check if the admin already exists
    const existingAdmin = await this.adminModel.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(this.configService.get<string>('ADMIN_PASSWORD'), 10);

      const adminData = {
        email: adminEmail,
        password: hashedPassword
      };

      const newAdmin = new this.adminModel(adminData);
      await newAdmin.save();
      console.log('Admin created successfully');
    } else {
      console.log('Admin already exists');
    }
  }

  async login(email: string, password: string): Promise<{ token: string }> {
    const admin = await this.adminModel.findOne({ email });
    if (!admin) {
      throw new UnauthorizedException('Invalid email');
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = { email: admin.email, sub: admin._id };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET')
    });

    return { token };
  }
}