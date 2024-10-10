import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('player')
export class PlayerEntity {
  @Column('varchar')
  password: string;

  @Column('varchar', {
    unique: true,
  })
  username: string;

  @PrimaryGeneratedColumn('uuid')
  uuid: string;
}
