import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('history_record')
export class HistoryRecordEntity {
  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
    name: 'date_time',
  })
  dateTime: string;

  @Column('bigint', {
    default: 0,
  })
  count: number;

  @Column('varchar')
  username: string;

  @PrimaryGeneratedColumn('uuid')
  uuid: string;
}
