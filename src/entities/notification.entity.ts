// src/entities/notification.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

export enum NotificationType {
  ATTENDANCE_REMINDER = 'attendance_reminder',
  ATTENDANCE_CONFIRMATION = 'attendance_confirmation',
  REPORT_READY = 'report_ready',
  SYSTEM_ALERT = 'system_alert',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  readAt: Date;
}