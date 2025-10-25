import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('medicines')
export class Medicine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nameBn: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  brand: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  brandBn: string;

  @Column({ type: 'text' })
  details: string;

  @Column({ type: 'text', nullable: true })
  detailsBn: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  origin: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  originBn: string;

  @Column({ type: 'text', nullable: true })
  sideEffects: string;

  @Column({ type: 'text', nullable: true })
  sideEffectsBn: string;

  @Column({ type: 'text', nullable: true })
  usage: string;

  @Column({ type: 'text', nullable: true })
  usageBn: string;

  @Column({ type: 'text', nullable: true })
  howToUse: string;

  @Column({ type: 'text', nullable: true })
  howToUseBn: string;

  @Column({ type: 'simple-array', nullable: true })
  images: string[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
