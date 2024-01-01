import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { Length, IsNotEmpty } from 'class-validator';
import { compareSync, hashSync } from 'bcryptjs';

@Entity()
@Unique(['username'])
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(3, 20)
  username: string;

  @Column()
  @Length(5, 50)
  email: string;

  @Column()
  @Length(5, 50)
  password: string;

  @Column()
  @IsNotEmpty()
  role: string;

  @Column()
  @CreateDateColumn()
  created: Date;

  @Column()
  @UpdateDateColumn()
  updated: Date;

  encrypt(unencryptedPassword: string) {
    return hashSync(unencryptedPassword, 8);
  }

  encryptPassword() {
    this.password = this.encrypt(this.password);
  }

  isUnencryptedPasswordValid(unencryptedPassword: string) {
    return compareSync(this.encrypt(unencryptedPassword), this.password);
  }
}