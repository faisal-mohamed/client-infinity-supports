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
  console.log("🔍 [fetchSettingsFromDB] ADMIN ID PASSED: ", adminId);
  
  try {
    // Handle null adminId properly - don't parse null to NaN
    let whereClause: any;
    
    if (adminId === null || adminId === undefined) {
      // Only fetch global settings (adminId: null) that are active
      whereClause = { 
        adminId: null,
        isActive: true 
      };
    } else {
      // Fetch both admin-specific and global settings (admin-specific takes precedence)
  const adminIdInt = parseInt(adminId);
      if (isNaN(adminIdInt)) {
        // If parsing fails, only get global settings
        whereClause = { 
          adminId: null,
          isActive: true 
        };
      } else {
        whereClause = {
          isActive: true,
        OR: [
          { adminId: adminIdInt },
          { adminId: null },
        ],
        };
      }
    }
    
    console.log("🔍 [fetchSettingsFromDB] Query where clause:", JSON.stringify(whereClause));
    
    const settings : any = await prisma.appSettings.findMany({
      where: whereClause,
      orderBy: [
        { category: 'asc' },
        { sortOrder: 'asc' },
      ],
    });

    console.log(`🔍 [fetchSettingsFromDB] Found ${settings.length} settings`);
    if (settings.length > 0) {
      console.log(`🔍 [fetchSettingsFromDB] Sample settings:`, settings.slice(0, 5).map((s: any) => ({ 
        key: s.key, 
        adminId: s.adminId, 
        value: s.value,
        isActive: s.isActive 
      })));
    }
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
    // ✅ OPTIMIZED: Query only the specific keys we need instead of fetching all settings
    // This is much faster, especially when there are many settings
    let whereClause: any;
    
    if (adminId === null || adminId === undefined) {
      // Only fetch global settings (adminId: null) for the specific keys
      whereClause = { 
        key: { in: keys },
        adminId: null,
        isActive: true 
      };
    } else {
      // Fetch both admin-specific and global settings for the specific keys
      const adminIdInt = parseInt(String(adminId));
      if (isNaN(adminIdInt)) {
        whereClause = { 
          key: { in: keys },
          adminId: null,
          isActive: true 
        };
      } else {
        whereClause = {
          key: { in: keys },
          isActive: true,
          OR: [
            { adminId: adminIdInt },
            { adminId: null },
          ],
        };
      }
    }

    // Query only the keys we need - much faster!
    const settings : any = await prisma.appSettings.findMany({
      where: whereClause,
      orderBy: [
        { adminId: 'desc' } // Admin-specific (numbers) first, then global (null) - so admin-specific can override
      ],
    });

    console.log(`🔍 [getMultipleSettingsFromDB] Looking for ${keys.length} keys with adminId: ${adminId}`);
    console.log(`🔍 [getMultipleSettingsFromDB] Found ${settings.length} matching settings (optimized query)`);

    const result: Record<string, string | null> = {};

    // Initialize all keys to null
    keys.forEach(key => result[key] = null);

    // Process settings: admin-specific override global
    // Settings are ordered by adminId DESC, so admin-specific (numbers) come before global (null)
    const processedKeys = new Set<string>();
    
    for (const setting of settings) {
      const key = setting.key;
      // Only process each key once (admin-specific takes precedence due to ordering)
      if (!processedKeys.has(key)) {
        processedKeys.add(key);
        result[key] = setting.value || setting.defaultValue || null;

        console.log(`🔍 [getMultipleSettingsForDB] Setting found for key "${key}":`, {
          key: setting.key,
          adminId: setting.adminId,
          value: setting.value ? 'SET' : 'EMPTY',
          source: setting.adminId === null ? 'GLOBAL' : 'ADMIN-SPECIFIC'
        });
      }
    }

    // Log any missing keys
    const missingKeys = keys.filter(key => !processedKeys.has(key));
    if (missingKeys.length > 0) {
      console.log(`⚠️ [getMultipleSettingsFromDB] Missing keys: ${missingKeys.join(', ')}`);
    }

    console.log(`🔍 [getMultipleSettingsFromDB] Final result:`, Object.keys(result).length, 'keys processed');
    return result;
  } catch (error) {
    console.error("Error getting multiple settings:", error);
    const result: Record<string, string | null> = {};
    keys.forEach(key => (result[key] = null));
    return result;
  }
}

/**
 * Get staff-specific settings for a given staff member and (optionally) formKey.
 *
 * This is used for staff PDFs so that:
 *  - Website & review date come from Staff Settings Categories
 *  - Form IDs come from Staff Form IDs
 *  - Returned object is already shaped for PDF components (website, *_form_id, *_review_date, company_website, review_date)
 */
export async function getStaffSettingsForForm(
  staffId: number,
  formKey?: string
): Promise<Record<string, string | null>> {
  try {
    // Find the admin who created this staff member
    const staff = await prisma.staff.findUnique({
      where: { id: staffId },
      select: { createdById: true },
    });

    let adminId = staff?.createdById ?? null;

    // If no admin, try fallback strategies:
    // 1. Try default admin (ID: 1) first (most common case)
    // 2. Then try to find ANY admin's settings (query all active settings)
    // 3. Finally try global settings (adminId: null)
    if (!adminId) {
      console.log(`⚠️ [getStaffSettingsForForm] Staff ${staffId} has no createdById, trying fallback strategies...`);
      
      // Strategy 1: Try default admin (ID: 1)
      const testKeys = ["staff_company_website", "staff_review_date", ...(formKey ? [`${formKey}_form_id`] : [])];
      const defaultAdminSettings = await getMultipleSettingsFromDB(testKeys, 1);
      
      // Check if we found any meaningful settings
      const hasDefaultSettings = defaultAdminSettings["staff_company_website"] || 
                                  defaultAdminSettings["staff_review_date"] || 
                                  (formKey && defaultAdminSettings[`${formKey}_form_id`]);
      
      if (hasDefaultSettings) {
        console.log(`✅ [getStaffSettingsForForm] Found settings with default admin (ID: 1), using those`);
        adminId = 1;
      } else {
        // Strategy 2: Try to find settings from ANY admin (query all active settings)
        console.log(`⚠️ [getStaffSettingsForForm] No settings found with default admin, trying to find from any admin...`);
        try {
          const allSettings = await prisma.appSettings.findMany({
            where: {
              isActive: true,
              key: { in: testKeys }
            },
            orderBy: [
              { adminId: 'desc' } // Prefer non-null adminId (admin-specific) over null (global)
            ]
          });
          
          if (allSettings.length > 0) {
            // Use the first adminId we find (prefer admin-specific over global)
            const foundAdminId = allSettings[0].adminId;
            console.log(`✅ [getStaffSettingsForForm] Found settings with adminId: ${foundAdminId}, using those`);
            adminId = foundAdminId;
          } else {
            // Strategy 3: Try global settings (adminId: null) as final fallback
            console.log(`⚠️ [getStaffSettingsForForm] No settings found from any admin, will try global settings (adminId: null)`);
            adminId = null;
          }
        } catch (error) {
          console.error(`❌ [getStaffSettingsForForm] Error finding settings from any admin:`, error);
          adminId = null; // Fallback to global
        }
      }
    }

    // Build list of keys we need from AppSettings
    const keys: string[] = [
      "staff_company_website",
      "staff_review_date",
    ];

    if (formKey) {
      keys.push(`${formKey}_form_id`);
    }

    console.log(`🔍 [getStaffSettingsForForm] Fetching settings with adminId: ${adminId}, keys:`, keys);
    const raw = await getMultipleSettingsFromDB(keys, adminId);
    console.log(`🔍 [getStaffSettingsForForm] Raw settings retrieved:`, raw);

    const website = raw["staff_company_website"];
    const reviewDate = raw["staff_review_date"];
    const formId = formKey ? raw[`${formKey}_form_id`] : null;
    
    console.log(`🔍 [getStaffSettingsForForm] Extracted values:`, {
      website,
      reviewDate,
      formId,
    });

    const settings: Record<string, string | null> = {};

    // Generic names used by many PDFs
    if (website) {
      settings.company_website = website;
      settings.website = website;
    }
    if (reviewDate) {
      settings.review_date = reviewDate;
    }

    // Form-specific mappings for PDF components that expect custom keys
    if (formKey && formId) {
      // Default: expose "<formKey>_form_id" so components can read it directly
      settings[`${formKey}_form_id`] = formId;
    }

    // Special cases where components expect additional names
    switch (formKey) {
      case "employee_welcome":
        if (formId) settings.employee_welcome_form_id = formId;
        if (reviewDate) settings.employee_welcome_review_date = reviewDate;
        break;
      case "support_worker":
        if (formId) settings.support_worker_form_id = formId;
        if (reviewDate) settings.support_worker_review_date = reviewDate;
        break;
      case "employee_details":
        if (formId) settings.employee_details_form_id = formId;
        if (reviewDate) settings.employee_details_review_date = reviewDate;
        break;
      case "documentation_acknowledgement":
        if (formId) settings.documentation_acknowledgement_form_id = formId;
        if (reviewDate) settings.documentation_acknowledgement_review_date = reviewDate;
        break;
      case "conflict_of_interest":
        if (formId) settings.conflict_of_interest_form_id = formId;
        if (reviewDate) settings.conflict_of_interest_review_date = reviewDate;
        break;
      case "vehicle_safety_inspection":
        if (formId) settings.vehicle_safety_inspection_form_id = formId;
        if (reviewDate) settings.vehicle_safety_inspection_review_date = reviewDate;
        break;
      case "pre_employment_medical":
        if (formId) settings.pre_employment_medical_form_id = formId;
        if (reviewDate) settings.pre_employment_medical_review_date = reviewDate;
        break;
      case "bullying_harassment_training":
        if (formId) settings.bullying_harassment_training_form_id = formId;
        if (reviewDate) settings.bullying_harassment_training_review_date = reviewDate;
        break;
      case "bullying_training":
        if (formId) settings.bullying_training_form_id = formId;
        if (reviewDate) settings.bullying_training_review_date = reviewDate;
        break;
      case "fair_work_information":
        if (formId) settings.fair_work_information_form_id = formId;
        if (reviewDate) settings.fair_work_information_review_date = reviewDate;
        break;
      case "ndis_code_of_conduct":
        if (formId) settings.ndis_code_of_conduct_form_id = formId;
        if (reviewDate) settings.ndis_code_of_conduct_review_date = reviewDate;
        break;
      case "orientation":
        if (formId) settings.orientation_form_id = formId;
        if (reviewDate) settings.orientation_review_date = reviewDate;
        break;
      default:
        break;
    }

    return settings;
  } catch (error) {
    console.error("Error getting staff settings for form:", error);
    return {};
  }
}




/**
 * Clear server-side settings cache
 */
export function clearServerSettingsCache(): void {
  serverSettingsCache = null;
  serverCacheTimestamp = 0;
}
