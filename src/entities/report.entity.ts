// src/entities/report.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

export enum ReportType {
  ATTENDANCE = 'attendance',
  GYM_USAGE = 'gym_usage',
  USER_ACTIVITY = 'user_activity',
  CUSTOM = 'custom',
}

export enum ReportFormat {
  PDF = 'pdf',
  EXCEL = 'excel',
  CSV = 'csv',
  JSON = 'json',
}

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ReportType,
    default: ReportType.ATTENDANCE,
  })
  type: ReportType;

  @Column({ type: 'json' })
  parameters: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  data: Record<string, any>;

  @Column({
    type: 'enum',
    enum: ReportFormat,
    default: ReportFormat.PDF,
  })
  format: ReportFormat;

  @Column({ nullable: true })
  filePath: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'generatedById' })
  generatedBy: User;

  @Column()
  generatedById: string;

  @CreateDateColumn()
  generatedAt: Date;

  @Column({ default: false })
  isScheduled: boolean;

  @Column({ nullable: true })
  scheduleExpression: string;
}