import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('player')
export class PlayerEntity {
  @Column('varchar')
  password: string;

  @Column('bigint')
  balance: number;

  @Column('varchar', {
    unique: true,
  })
  username: string;

  @PrimaryGeneratedColumn('uuid')
  uuid: string;
}
