import { getServerSession } from "next-auth";
import { getSettingsByAdmin, getSettingByKey } from "./db/settings";
import { authOptions } from "./authOptions";

export async function fetchSettingsFromDB(adminId: string | null): Promise<any[]> {
  try {
    const id = adminId || "GLOBAL";
    const settings = await getSettingsByAdmin(id);
    return settings;
  } catch (error) {
    console.error("Error fetching settings from database:", error);
    return [];
  }
}

export async function getSettingFromDB(key: string, defaultValue?: string): Promise<string | null> {
  try {
    const session = await getServerSession(authOptions);
    const adminId = session?.user?.id || "GLOBAL";
    const setting = await getSettingByKey(adminId, key);
    return setting?.value || setting?.defaultValue || defaultValue || null;
  } catch (error) {
    console.error(`Error getting setting "${key}":`, error);
    return defaultValue || null;
  }
}

export async function getMultipleSettingsFromDB(
  keys: string[],
  adminId: string | null
): Promise<Record<string, string | null>> {
  try {
    const id = adminId || "GLOBAL";
    const settings = await getSettingsByAdmin(id);
    const result: Record<string, string | null> = {};

    for (const key of keys) {
      const setting = settings.find((s: any) => s.key === key);
      result[key] = setting ? (setting.value || setting.defaultValue || null) : null;
    }
    return result;
  } catch (error) {
    console.error("Error getting multiple settings:", error);
    const result: Record<string, string | null> = {};
    keys.forEach((key) => (result[key] = null));
    return result;
  }
}

export function clearServerSettingsCache(): void {
  // No-op — DynamoDB doesn't need cache invalidation at this layer
}
