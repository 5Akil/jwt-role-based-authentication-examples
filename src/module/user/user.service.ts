import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { RegisterUserDto } from '../auth/dto/registerUser.dto';
import { UserResponse } from './type/userResponse';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async findUserWithPassword(email: string): Promise<User> {
    return await this.userRepository.findOne({
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'role',
        'password',
      ],
      where: { email },
    });
  }

  async findOneById(id: number): Promise<UserResponse> {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  async create(user: RegisterUserDto): Promise<UserResponse> {
    console.log(user);
  
    const newUser = await this.userRepository.create(user);
    await this.userRepository.save(newUser);
    const { password, createdAt, updatedAt, ...userResult } = newUser;
    return userResult;
  }
}
