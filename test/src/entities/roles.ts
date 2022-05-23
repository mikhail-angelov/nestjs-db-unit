import { Column, Entity, PrimaryGeneratedColumn, OneToMany,CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './users';

export enum RoleCode {
  user = 'user',
  admin = 'admin',
}

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ type: 'enum', enum: RoleCode, unique: true })
  code: string;

  @OneToMany(() => User, (user) => user.roleId, {
    cascade: true,
  })
  users?: User[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
