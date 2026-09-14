//src/accounting/entities/journal-entry-line.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { JournalEntry } from './journal-entry.entity';
import { Account } from './account.entity';

@Entity('journal_entry_lines')
export class JournalEntryLine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  journalEntryId: string;

  @ManyToOne(() => JournalEntry, (entry) => entry.lines, { onDelete: 'CASCADE' })
  journalEntry: JournalEntry;

  @Column({ type: 'uuid' })
  accountId: string;

  @ManyToOne(() => Account)
  account: Account;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  debit: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  credit: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;
}