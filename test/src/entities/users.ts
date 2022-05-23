import { Column, Entity, Index, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Generated, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Role } from './roles';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // @Index('email')
  @Column({ unique: true })
  email!: string;

  @Generated('increment')
  @Column()
  count!: number;

  @Column({ nullable: false, name: 'role_id' })
  roleId!: string;

  @ManyToOne(() => Role, (role) => role.users, {})
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ type: 'json', nullable: true })
  meta!: object;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
