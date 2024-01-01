import { MigrationInterface, QueryRunner } from 'typeorm';

import { dataSource } from '../data-source';
import { User } from '../entity/User';

export class CreateAdminUser1704140647315 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    let user = new User();
    user.username = 'admin';
    user.email = 't0mpr1c3@gmail.com';
    user.password = 'admin';
    user.hashPassword();
    user.role = 'ADMIN';
    const userRepository = dataSource.getRepository(User);
    await userRepository.save(user);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }
}
