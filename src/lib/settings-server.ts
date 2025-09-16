// Server-side settings utility functions that directly query the database
// Use this for server-side operations like email sending

import { getServerSession } from "next-auth";
import { prisma } from "./prisma";
import { authOptions } from "./authOptions";

interface AppSetting {
  id: number;
  key: string;
  value: string | null;
  type: string;
  category: string;
  label: string;
  description?: string;
  isRequired: boolean;
  defaultValue?: string;
  validation?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Cache for server-side settings
let serverSettingsCache: any | null = null;
let serverCacheTimestamp: number = 0;
const SERVER_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch all settings directly from database (server-side)
 */
// export async function fetchSettingsFromDB(forceRefresh = false): Promise<AppSetting[]> {
//   const now = Date.now();
  
//   // Return cached settings if still valid and not forcing refresh
//   if (!forceRefresh && serverSettingsCache && (now - serverCacheTimestamp) < SERVER_CACHE_DURATION) {
//     return serverSettingsCache;
//   }

//   try {
//     const settings : any = await prisma.appSettings.findMany({
//       where: {
//         isActive: true
//       },
//       orderBy: [
//         { category: 'asc' },
//         { sortOrder: 'asc' }
//       ]
//     });

//     serverSettingsCache  = settings;
//     serverCacheTimestamp = now;
    
//     return settings;
//   } catch (error) {
//     console.error('Error fetching settings from database:', error);
//     return serverSettingsCache || [];
//   }
// }

export async function fetchSettingsFromDB(adminId: any | null): Promise<AppSetting[]> {

  const adminIdInt = parseInt(adminId);


  console.log("ADMIN ID PASSED: ", adminId);
  try {
    const settings : any = await prisma.appSettings.findMany({
      where: {
        OR: [
          { adminId: adminIdInt },
          { adminId: null },
        ],
      },
      orderBy: [
        { category: 'asc' },
        { sortOrder: 'asc' },
      ],
    });



    return settings;
  } catch (error) {
    console.error('Error fetching settings from database:', error);
    return [];
  }
}


/**
 * Get a specific setting value by key (server-side)
 */


export async function getSettingFromDB(key: string, defaultValue?: string): Promise<string | null> {
  try {
    const session = await getServerSession(authOptions);
    const adminId = session?.user?.id ? parseInt(session.user.id) : null;

    const settings = await fetchSettingsFromDB(adminId);
    const setting = settings.find(s => s.key === key);

    if (setting) {
      return setting.value || setting.defaultValue || defaultValue || null;
    }

    return defaultValue || null;
  } catch (error) {
    console.error(`Error getting setting "${key}":`, error);
    return defaultValue || null;
  }
}


/**
 * Get multiple settings at once (server-side)
 */
// export async function getMultipleSettingsFromDB(keys: string[], adminId: number | null): Promise<Record<string, string | null>> {
//   try {
//     const settings = await fetchSettingsFromDB(adminId);
//     const result: Record<string, string | null> = {};

//     console.log("Settings fetched for multiple keys------------------:", settings);

//     for (const key of keys) {
//       const setting = settings.find(s => s.key === key);
//       result[key] = setting ? (setting.value || setting.defaultValue || null) : null;
//     }


//     return result;
//   } catch (error) {
//     console.error('Error getting multiple settings:', error);
//     const result: Record<string, string | null> = {};
//     keys.forEach(key => result[key] = null);
//     return result;
//   }
// }

export async function getMultipleSettingsFromDB(
  keys: string[],
  adminId: number | null
): Promise<Record<string, string | null>> {
  try {
    const settings : any  = await fetchSettingsFromDB(adminId);
    const result: Record<string, string | null> = {};

 

    for (const key of keys) {
      // ✅ Prefer admin-specific, fallback to global
      const setting =
        settings.find((s: any) => s.key === key && s.adminId === Number(adminId)) ||
        settings.find((s: any) => s.key === key && s.adminId === null);

      console.log(`Setting found for key "${key}":`, setting);

      result[key] = setting ? (setting.value || setting.defaultValue || null) : null;
    }

    

    return result;
  } catch (error) {
    console.error("Error getting multiple settings:", error);
    const result: Record<string, string | null> = {};
    keys.forEach(key => (result[key] = null));
    return result;
  }
}




/**
 * Clear server-side settings cache
 */
export function clearServerSettingsCache(): void {
  serverSettingsCache = null;
  serverCacheTimestamp = 0;
}
