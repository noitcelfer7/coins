import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('player')
export class PlayerEntity {
  @Column('varchar')
  password: string;

  @Column('bigint', {
    default: 0,
    nullable: true,
  })
  balance: number;

  @Column('varchar', {
    unique: true,
  })
  username: string;

  @PrimaryGeneratedColumn('uuid')
  uuid: string;
}
