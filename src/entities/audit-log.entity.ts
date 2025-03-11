// src/entities/audit-log.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

export enum ActionType {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  LOGIN = 'login',
  LOGOUT = 'logout',
  EXPORT = 'export',
}

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    type: 'enum',
    enum: ActionType,
  })
  action: ActionType;

  @Column()
  entityName: string;

  @Column({ nullable: true })
  entityId: string;

  @Column({ type: 'json', nullable: true })
  oldValues: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  newValues: Record<string, any>;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;

  @CreateDateColumn()
  timestamp: Date;
}