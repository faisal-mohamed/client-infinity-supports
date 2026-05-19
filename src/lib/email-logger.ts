import { createActivityLog } from "./db/audit";

export interface EmailLogEntry {
  type: 'batch_completed' | 'test_email';
  recipient: string;
  subject: string;
  clientId?: string;
  clientName?: string;
  batchId?: string;
  formsCount?: number;
  attachmentsCount?: number;
  messageId?: string;
  status: 'success' | 'failed' | 'retry';
  error?: string;
  attemptCount?: number;
  sentAt?: Date;
}

export async function logEmailSuccess(entry: EmailLogEntry): Promise<void> {
  try {
    await createActivityLog({
      clientId: entry.clientId || undefined,
      logType: "ADMIN",
      action: `Email Sent: ${entry.type}`,
      metadata: {
        recipient: entry.recipient,
        subject: entry.subject,
        messageId: entry.messageId,
        status: entry.status,
        clientName: entry.clientName,
        batchId: entry.batchId,
        formsCount: entry.formsCount,
        attachmentsCount: entry.attachmentsCount,
        sentAt: entry.sentAt?.toISOString(),
      },
    });
  } catch (error) {
    console.error("Failed to log email success:", error);
  }
}

export async function logEmailFailure(entry: EmailLogEntry): Promise<void> {
  try {
    await createActivityLog({
      clientId: entry.clientId || undefined,
      logType: "ADMIN",
      action: `Email Failed: ${entry.type}`,
      metadata: {
        recipient: entry.recipient,
        subject: entry.subject,
        status: entry.status,
        error: entry.error,
        attemptCount: entry.attemptCount,
        clientName: entry.clientName,
        batchId: entry.batchId,
      },
    });
  } catch (error) {
    console.error("Failed to log email failure:", error);
  }
}
