import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Medicine } from '../../medicines/entities/medicine.entity';
import { SearchResultDto } from '../dto/search-result.dto';

@Entity('user_histories')
export class UserHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  actionType: 'scan' | 'upload' | 'view';

  @Column({ type: 'text', nullable: true })
  imageData: string; // Store image URI or path

  @Column({ type: 'jsonb', nullable: true })
  resultData: SearchResultDto[] | null; // Store the result data from the scan/upload

  @Column({ type: 'boolean', default: false })
  isSuccessful: boolean;

  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Medicine, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'medicine_id' })
  medicine: Medicine;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
