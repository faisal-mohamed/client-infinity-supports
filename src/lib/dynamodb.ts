import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const ddbClient = new DynamoDBClient({
  region: process.env.AWS_REGION || "ap-southeast-2",
});

export const dynamodb = DynamoDBDocumentClient.from(ddbClient, {
  marshallOptions: { removeUndefinedValues: true },
});

export const TABLE = process.env.DYNAMODB_TABLE_PREFIX || "InfinitySupports";
export const AUDIT_TABLE = `${TABLE}_Audit`;
export const NOTIFICATIONS_TABLE = `${TABLE}_Notifications`;
export const SETTINGS_TABLE = `${TABLE}_Settings`;
