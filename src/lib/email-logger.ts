// Email logging system for tracking email delivery and failures

import { prisma } from './prisma';

export interface EmailLogEntry {
  type: 'batch_completed' | 'test_email';
  recipient: string;
  subject: string;
  clientId?: number;
  clientName?: string;
  batchId?: number;
  formsCount?: number;
  attachmentsCount?: number;
  messageId?: string;
  status: 'success' | 'failed' | 'retry';
  error?: string;
  attemptCount?: number;
  sentAt?: Date;
}

/**
 * Log successful email delivery
 */
export async function logEmailSuccess(entry: EmailLogEntry): Promise<void> {
  try {
    await prisma.formActivityLog.create({
      data: {
        clientId: entry.clientId || null,
        adminId: null, // System-generated email
        logType: 'ADMIN',
        action: 'Email Sent Successfully',
        metadata: {
          emailType: entry.type,
          recipient: entry.recipient,
          subject: entry.subject,
          clientName: entry.clientName,
          batchId: entry.batchId,
          formsCount: entry.formsCount,
          attachmentsCount: entry.attachmentsCount,
          messageId: entry.messageId,
          status: 'success',
          sentAt: new Date().toISOString()
        }
      }
    });

    console.log(`📧✅ Email success logged:`, {
      type: entry.type,
      recipient: entry.recipient,
      messageId: entry.messageId,
      attachments: entry.attachmentsCount
    });
  } catch (error) {
    console.error('❌ Failed to log email success:', error);
    // Don't throw - logging failure shouldn't break email sending
  }
}

/**
 * Log email delivery failure
 */
export async function logEmailFailure(entry: EmailLogEntry): Promise<void> {
  try {
    await prisma.formActivityLog.create({
      data: {
        clientId: entry.clientId || null,
        adminId: null, // System-generated email
        logType: 'ADMIN',
        action: 'Email Send Failed',
        metadata: {
          emailType: entry.type,
          recipient: entry.recipient,
          subject: entry.subject,
          clientName: entry.clientName,
          batchId: entry.batchId,
          formsCount: entry.formsCount,
          status: 'failed',
          error: entry.error,
          attemptCount: entry.attemptCount || 1,
          failedAt: new Date().toISOString()
        }
      }
    });

    console.log(`📧❌ Email failure logged:`, {
      type: entry.type,
      recipient: entry.recipient,
      error: entry.error,
      attempts: entry.attemptCount
    });
  } catch (error) {
    console.error('❌ Failed to log email failure:', error);
    // Don't throw - logging failure shouldn't break the main flow
  }
}

/**
 * Log email retry attempt
 */
export async function logEmailRetry(entry: EmailLogEntry): Promise<void> {
  try {
    await prisma.formActivityLog.create({
      data: {
        clientId: entry.clientId || null,
        adminId: null,
        logType: 'ADMIN',
        action: 'Email Retry Attempt',
        metadata: {
          emailType: entry.type,
          recipient: entry.recipient,
          subject: entry.subject,
          clientName: entry.clientName,
          batchId: entry.batchId,
          status: 'retry',
          attemptCount: entry.attemptCount || 1,
          error: entry.error,
          retryAt: new Date().toISOString()
        }
      }
    });

    console.log(`📧🔄 Email retry logged:`, {
      type: entry.type,
      recipient: entry.recipient,
      attempt: entry.attemptCount,
      error: entry.error
    });
  } catch (error) {
    console.error('❌ Failed to log email retry:', error);
  }
}

/**
 * Get email delivery statistics
 */
export async function getEmailStats(days: number = 7): Promise<{
  totalEmails: number;
  successfulEmails: number;
  failedEmails: number;
  retryAttempts: number;
  successRate: number;
}> {
  try {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const emailLogs = await prisma.formActivityLog.findMany({
      where: {
        action: {
          in: ['Email Sent Successfully', 'Email Send Failed', 'Email Retry Attempt']
        },
        createdAt: {
          gte: since
        }
      },
      select: {
        action: true,
        metadata: true
      }
    });

    const stats = {
      totalEmails: 0,
      successfulEmails: 0,
      failedEmails: 0,
      retryAttempts: 0,
      successRate: 0
    };

    emailLogs.forEach(log => {
      switch (log.action) {
        case 'Email Sent Successfully':
          stats.successfulEmails++;
          break;
        case 'Email Send Failed':
          stats.failedEmails++;
          break;
        case 'Email Retry Attempt':
          stats.retryAttempts++;
          break;
      }
    });

    stats.totalEmails = stats.successfulEmails + stats.failedEmails;
    stats.successRate = stats.totalEmails > 0 
      ? Math.round((stats.successfulEmails / stats.totalEmails) * 100) 
      : 0;

    return stats;
  } catch (error) {
    console.error('❌ Failed to get email stats:', error);
    return {
      totalEmails: 0,
      successfulEmails: 0,
      failedEmails: 0,
      retryAttempts: 0,
      successRate: 0
    };
  }
}

/**
 * Get recent email failures for debugging
 */
export async function getRecentEmailFailures(limit: number = 10): Promise<any[]> {
  try {
    const failures = await prisma.formActivityLog.findMany({
      where: {
        action: 'Email Send Failed'
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      select: {
        createdAt: true,
        metadata: true
      }
    });

    return failures.map(failure => ({
      timestamp: failure.createdAt,
      ...failure.metadata
    }));
  } catch (error) {
    console.error('❌ Failed to get recent email failures:', error);
    return [];
  }
}
