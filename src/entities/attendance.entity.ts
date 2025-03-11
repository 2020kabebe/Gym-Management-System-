// src/entities/attendance.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Gym } from './gym.entity';

@Entity('attendances')
export class Attendance {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => User, user => user.attendances)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Gym, gym => gym.attendances)
  @JoinColumn({ name: 'gymId' })
  gym: Gym;

  @Column()
  gymId: string;

  @Column()
  checkInTime: Date;

  @Column({ nullable: true })
  confirmedBy: string;

  @Column({ nullable: true })
  confirmationTime: Date;

  @Column({ default: false })
  isConfirmed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}