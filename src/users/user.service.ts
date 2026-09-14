// src/users/users.service.ts
import {
  ConflictException,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';

const SALT_ROUNDS = 10;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: string;
  subRole?: string;
  companyId: string;
  branchId?: string;
  mustChangePassword?: boolean;
  passwordChangedAt?: Date;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(input: CreateUserInput): Promise<User> {
    if (!input.name?.trim()) {
      throw new BadRequestException('El nombre es obligatorio.');
    }
    if (!input.email || !EMAIL_REGEX.test(input.email)) {
      throw new BadRequestException('El email no es válido.');
    }
    if (!input.password || (input.password.length < 8 && input.password !== 'tmsprofesional')) {
      throw new BadRequestException(
        'La contraseña debe tener al menos 8 caracteres.',
      );
    }
    if (!input.companyId) {
      throw new BadRequestException('companyId es obligatorio.');
    }

    const existing = await this.userRepository.findOne({
      where: { email: input.email.toLowerCase().trim() },
    });
    if (existing) {
      throw new ConflictException('Ya existe un usuario con ese email.');
    }

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

    const user = this.userRepository.create({
      name: input.name.trim(),
      email: input.email.toLowerCase().trim(),
      passwordHash,
      role: input.role ?? 'employee',
      subRole: input.subRole ?? null,
      companyId: input.companyId,
      branchId: input.branchId,
      mustChangePassword: input.mustChangePassword ?? (input.password === 'tmsprofesional'),
      passwordChangedAt: input.passwordChangedAt ?? new Date(),
    });

    const saved = await this.userRepository.save(user);
    delete (saved as Partial<User>).passwordHash;
    return saved;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email: email.toLowerCase().trim() } });
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  // Lista SOLO los usuarios de la empresa del token (nunca todas las
  // empresas) — usado para la pantalla de "colaboradores" del admin.
  async findAllByCompany(companyId: string): Promise<User[]> {
    return await this.userRepository.find({ where: { companyId } });
  }
  
  async updatePassword(userId: string, newPasswordHash: string): Promise<void> {
    await this.userRepository.update(userId, {
      passwordHash: newPasswordHash,
      mustChangePassword: false,
      passwordChangedAt: new Date(),
    });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email: email.toLowerCase().trim() })
      .getOne();
  }
}