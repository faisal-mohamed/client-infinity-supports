/**
 * Platform DynamoDB Client
 * Separate table reference for Super Admin / SaaS platform data
 */

import { dynamodb } from '../../dynamodb';
import { generateId, nowISO } from '../../dynamodb-utils';

const PREFIX = process.env.DYNAMODB_TABLE_PREFIX || 'InfinitySupports';
export const PLATFORM_TABLE = `${PREFIX}_Platform`;

export { dynamodb, generateId, nowISO };
