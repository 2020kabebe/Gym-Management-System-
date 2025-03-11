// src/entities/gym.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Attendance } from './attendance.entity';

@Entity('gyms')
export class Gym {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  Gym_name: string;

  @Column()
  Location: string;

  @Column('decimal')
  membership_fees: number;

  @Column({ nullable: true })
  facilities: string;

  @Column()
  Opening_Hours: string;

  @Column({ nullable: true })
  Phone_number: string;

  @Column({ nullable: true })
  Email: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Attendance, attendance => attendance.gym)
  attendances: Attendance[];
}