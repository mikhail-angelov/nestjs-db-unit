import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { User } from './users';
import { CreateDateColumnEx, UpdateDateColumnEx } from '../../../dist';

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'name', nullable: false })
  name: string;

  @OneToMany(() => User, (user) => user.roleId, {
    cascade: true,
  })
  users?: User[];

  @CreateDateColumnEx({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumnEx({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
