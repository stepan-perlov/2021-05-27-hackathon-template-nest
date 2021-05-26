import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';

import { CreateUserDto } from './models/create_user.dto';
import { UpdateUserDto } from './models/update_user.dto';
import { User } from './models/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private connection: Connection,
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<{ id: number }> {
    const user = this.usersRepo.create({
      login: createUserDto.login,
      email: createUserDto.email,
      phone: createUserDto.phone,
      password: createUserDto.password,
      name: createUserDto.name,
      surname: createUserDto.surname,
      patronymic: createUserDto.patronymic,
      active: createUserDto.active,
    });
    const result: User = await this.usersRepo.save(user);
    return { id: result.id };
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepo.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepo.findOne(id);
    if (user) {
      return user;
    } else {
      throw new NotFoundException(
        `Entity system.users with id = ${id} not found`,
      );
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const runner = this.connection.createQueryRunner();

    await runner.connect();
    await runner.startTransaction();
    try {
      const res1 = await runner.manager.query(`
                SELECT 1
                FROM system.users
                WHERE id = ${id}
                FOR UPDATE;
            `);
      if (res1.length == 0) {
        throw new NotFoundException(
          `Entity system.users with id = ${id} not found`,
        );
      }

      const res2 = await runner.manager.query(`
                SELECT 1
                FROM system.users
                WHERE id = ${id}
                    AND version = ${updateUserDto.version};
            `);
      if (res2.length == 0) {
        throw new ConflictException(
          `Entity system.users with id = ${id} version changed.`,
        );
      }

      const user = this.usersRepo.create({
        id: id,
        login: updateUserDto.login,
        email: updateUserDto.email,
        phone: updateUserDto.phone,
        password: updateUserDto.password,
        name: updateUserDto.name,
        surname: updateUserDto.surname,
        patronymic: updateUserDto.patronymic,
        active: updateUserDto.active,
      });
      await runner.manager.getRepository(User).save(user);

      await runner.commitTransaction();
    } catch (err) {
      await runner.rollbackTransaction();
      throw err;
    } finally {
      await runner.release();
    }

    return {};
  }

  async remove(id: number) {
    const runner = this.connection.createQueryRunner();

    await runner.connect();
    await runner.startTransaction();
    try {
      const res1 = await runner.manager.query(`
                SELECT 1
                FROM system.users
                WHERE id = ${id}
                FOR UPDATE;
            `);
      if (res1.length == 0) {
        throw new NotFoundException(
          `Entity system.users with id = ${id} not found`,
        );
      }

      await runner.manager.getRepository(User).delete(id);
      await runner.commitTransaction();
    } catch (err) {
      await runner.rollbackTransaction();
      throw err;
    } finally {
      await runner.release();
    }

    return {};
  }
}
