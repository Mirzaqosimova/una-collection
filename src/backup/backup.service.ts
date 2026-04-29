import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { exec } from 'child_process';
import { promisify } from 'util';
import { createWriteStream, createReadStream } from 'fs';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as archiver from 'archiver';
import { cwd } from 'process';
import FormData = require('form-data');
import axios from 'axios';

const execAsync = promisify(exec);

@Injectable()
export class BackupService {
  private readonly logger = new Logger(BackupService.name);

  constructor(private readonly config: ConfigService) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async runBackup() {
    console.log('------');
    this.logger.log('Starting backup...');
    const tmpDir = path.join(cwd(), 'tmp_backup');
    await fs.mkdir(tmpDir, { recursive: true });

    const sqlPath = path.join(tmpDir, `backup_${Date.now()}.sql`);
    const zipPath = path.join(tmpDir, `uploads_${Date.now()}.zip`);

    try {
      await this.dumpDatabase(sqlPath);
      await this.zipUploads(zipPath);
      await this.sendToTelegram(sqlPath, zipPath);
      this.logger.log('Backup sent to Telegram successfully');
    } catch (err) {
      this.logger.error('Backup failed', err?.message);
    } finally {
      await fs.rm(tmpDir, { recursive: true, force: true });
    }
  }

  private async dumpDatabase(sqlPath: string) {
    const user = this.config.get<string>('DB_USER', 'postgres');
    const password = this.config.get<string>('DB_PASSWORD', 'postgres');
    const db = this.config.get<string>('DB_NAME', 'postgres');

    const { stderr } = await execAsync(
      `PGPASSWORD="${password}" pg_dump -h 127.0.0.1 -p 5432 -U ${user} ${db} -f "${sqlPath}"`,
      { shell: '/bin/sh' },
    );

    const stat = await fs.stat(sqlPath);
    if (stat.size === 0) {
      throw new Error('pg_dump produced an empty file');
    }

    if (stderr) {
      this.logger.warn('pg_dump stderr: ' + stderr);
    }
  }

  private zipUploads(zipPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const output = createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 6 } });

      output.on('close', resolve);
      archive.on('error', reject);

      archive.pipe(output);
      archive.directory(path.join(cwd(), 'uploads'), 'uploads');
      archive.finalize();
    });
  }

  private async sendToTelegram(sqlPath: string, zipPath: string) {
    const token = this.config.get<string>('BOT_TOKEN');
    const chatId = this.config.get<string>('ERROR_SENDER_GROUP_ID');
    const threadId = this.config.get<string>('ERROR_MESSAGE_THREAD_ID');
    const url = `https://api.telegram.org/bot${token}/sendDocument`;

    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

    for (const filePath of [sqlPath, zipPath]) {
      const form = new FormData();
      form.append('chat_id', chatId);
      form.append('message_thread_id', threadId);
      form.append('caption', `🗄 Backup — ${now}`);
      form.append(
        'document',
        createReadStream(filePath),
        path.basename(filePath),
      );

      await axios.post(url, form, { headers: form.getHeaders() });
    }
  }
}
