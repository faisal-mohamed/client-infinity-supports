import {
  GetCommand,
  PutCommand,
  QueryCommand,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import { dynamodb, SETTINGS_TABLE } from "../dynamodb";
import { generateId, nowISO } from "../dynamodb-utils";

export interface AppSetting {
  id: string;
  key: string;
  value?: string;
  type: string;
  category: string;
  label: string;
  description?: string;
  isRequired: boolean;
  defaultValue?: string;
  validation?: string;
  sortOrder: number;
  isActive: boolean;
  adminId: string; // "GLOBAL" for global defaults
  createdAt: string;
  updatedAt: string;
}

export async function getSettingsByAdmin(adminId: string, category?: string): Promise<AppSetting[]> {
  let params: any = {
    TableName: SETTINGS_TABLE,
    KeyConditionExpression: category
      ? "PK = :pk AND begins_with(SK, :cat)"
      : "PK = :pk",
    ExpressionAttributeValues: category
      ? { ":pk": `ADMIN#${adminId}`, ":cat": `${category}#` }
      : { ":pk": `ADMIN#${adminId}` },
    FilterExpression: "isActive = :active",
  };
  params.ExpressionAttributeValues[":active"] = true;

  const res = await dynamodb.send(new QueryCommand(params));
  return (res.Items || []) as AppSetting[];
}

export async function getSettingByKey(adminId: string, key: string): Promise<AppSetting | null> {
  const res = await dynamodb.send(
    new QueryCommand({
      TableName: SETTINGS_TABLE,
      IndexName: "GSI1",
      KeyConditionExpression: "GSI1PK = :pk AND GSI1SK = :sk",
      ExpressionAttributeValues: { ":pk": `ADMIN#${adminId}`, ":sk": `KEY#${key}` },
    })
  );
  return res.Items?.[0] ? (res.Items[0] as AppSetting) : null;
}

export async function upsertSetting(adminId: string, data: Partial<AppSetting> & { key: string }): Promise<AppSetting> {
  const existing = await getSettingByKey(adminId, data.key);
  const now = nowISO();

  const setting: AppSetting = {
    id: existing?.id || generateId(),
    key: data.key,
    value: data.value ?? existing?.value ?? data.defaultValue ?? "",
    type: data.type || existing?.type || "text",
    category: data.category || existing?.category || "general",
    label: data.label || existing?.label || data.key,
    description: data.description ?? existing?.description,
    isRequired: data.isRequired ?? existing?.isRequired ?? false,
    defaultValue: data.defaultValue ?? existing?.defaultValue,
    validation: data.validation ?? existing?.validation,
    sortOrder: data.sortOrder ?? existing?.sortOrder ?? 0,
    isActive: data.isActive ?? existing?.isActive ?? true,
    adminId,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  await dynamodb.send(
    new PutCommand({
      TableName: SETTINGS_TABLE,
      Item: {
        PK: `ADMIN#${adminId}`,
        SK: `${setting.category}#${String(setting.sortOrder).padStart(4, "0")}#${setting.key}`,
        GSI1PK: `ADMIN#${adminId}`,
        GSI1SK: `KEY#${setting.key}`,
        entityType: "APP_SETTING",
        ...setting,
      },
    })
  );

  return setting;
}

export async function bulkUpsertSettings(adminId: string, settings: Array<Partial<AppSetting> & { key: string }>): Promise<AppSetting[]> {
  const results: AppSetting[] = [];
  // Process in batches (DynamoDB BatchWrite doesn't support conditional writes, so use individual puts)
  for (const s of settings) {
    results.push(await upsertSetting(adminId, s));
  }
  return results;
}

export async function copyGlobalSettingsToAdmin(adminId: string): Promise<number> {
  const globalSettings = await getSettingsByAdmin("GLOBAL");
  if (globalSettings.length === 0) return 0;

  for (const setting of globalSettings) {
    await upsertSetting(adminId, {
      ...setting,
      value: setting.defaultValue || "",
    });
  }
  return globalSettings.length;
}

export async function getSettingsCount(adminId: string): Promise<number> {
  const res = await dynamodb.send(
    new QueryCommand({
      TableName: SETTINGS_TABLE,
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: { ":pk": `ADMIN#${adminId}` },
      Select: "COUNT",
    })
  );
  return res.Count || 0;
}
