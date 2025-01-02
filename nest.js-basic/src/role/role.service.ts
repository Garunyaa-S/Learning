import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { Role } from './entities/role.entity';
import { Admin } from 'src/admin/models/admin.model';
import { Session } from 'src/admin/models/session.model';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    @InjectModel(Role.name) private roleModel: Model<Role>,
    @InjectModel(Session.name) private sessionModel: Model<Session>,
    private jwtService: JwtService,
  ) { }

  async validateSession(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token);

      const session = await this.sessionModel.findOne({ session_token: token });
      if (!session) {
        throw new Error('Invalid session token');
      }

      const admin = await this.adminModel.findOne({ email: decoded.email });
      if (!admin) {
        throw new Error('Admin not found');
      }

      return admin;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  // Create a new role
  async create(roleData: CreateRoleDto): Promise<Role> {
    const newRole = new this.roleModel(roleData);
    return newRole.save();
  }

  // Get all roles
  async findAll(): Promise<Role[]> {
    return this.roleModel.find().sort({ created_at: -1 }).exec();
  }

  // Find a role by ID
  async findOne(id: string): Promise<Role> {
    return this.roleModel.findById(id).exec();
  }

  // Update a role
  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    return this.roleModel.findByIdAndUpdate(id, updateRoleDto, { new: true }).exec();
  }

  // Delete a role
  remove(id: string): Promise<any> {
    return this.roleModel.findByIdAndDelete(id).exec();
  }
}