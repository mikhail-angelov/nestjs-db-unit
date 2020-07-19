import { Column, Entity, Index, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from './roles';
import { CreateDateColumnEx, UpdateDateColumnEx, ColumnEx } from '../../../dist';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('email')
  @Column({ unique: true })
  email!: string;

  @Column({ nullable: false, name: 'role_id' })
  roleId!: string;

  @ManyToOne(() => Role, (role) => role.users, {})
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ColumnEx({ type: 'json', nullable: true })
  meta!: object;

  @CreateDateColumnEx({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumnEx({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
