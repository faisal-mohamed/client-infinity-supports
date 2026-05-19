import { useState, useEffect, useCallback } from 'react';
import { fetchSettings, getSetting, updateSetting, updateSettings, clearSettingsCache } from '@/lib/settings';

interface AppSetting {
  id: string | number;
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
  createdAt: string;
  updatedAt: string;
}

interface GroupedSettings {
  [category: string]: AppSetting[];
}

interface UseSettingsReturn {
  settings: GroupedSettings;
  loading: boolean;
  error: string | null;
  refreshSettings: () => Promise<void>;
  getSetting: (key: string, defaultValue?: string) => Promise<string | null>;
  updateSetting: (key: string, value: string) => Promise<boolean>;
  updateMultipleSettings: (settings: Array<{ key: string; value: string }>) => Promise<boolean>;
}

/**
 * Hook for managing application settings
 */
export function useSettings(): UseSettingsReturn {
  const [settings, setSettings] = useState<GroupedSettings>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const settingsData = await fetchSettings(forceRefresh);
      setSettings(settingsData);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load settings';
      setError(errorMessage);
      console.error('Error loading settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshSettings = useCallback(async () => {
    await loadSettings(true);
  }, [loadSettings]);

  const getSettingValue = useCallback(async (key: string, defaultValue?: string) => {
    return await getSetting(key, defaultValue);
  }, []);

  const updateSettingValue = useCallback(async (key: string, value: string) => {
    const success = await updateSetting(key, value);
    if (success) {
      await refreshSettings();
    }
    return success;
  }, [refreshSettings]);

  const updateMultipleSettingsValues = useCallback(async (settingsToUpdate: Array<{ key: string; value: string }>) => {
    const success = await updateSettings(settingsToUpdate);
    if (success) {
      await refreshSettings();
    }
    return success;
  }, [refreshSettings]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    settings,
    loading,
    error,
    refreshSettings,
    getSetting: getSettingValue,
    updateSetting: updateSettingValue,
    updateMultipleSettings: updateMultipleSettingsValues
  };
}

/**
 * Hook for getting a specific setting value
 */
export function useSetting(key: string, defaultValue?: string) {
  const [value, setValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSetting = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const settingValue = await getSetting(key, defaultValue);
      setValue(settingValue);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load setting';
      setError(errorMessage);
      console.error(`Error loading setting ${key}:`, err);
    } finally {
      setLoading(false);
    }
  }, [key, defaultValue]);

  const updateValue = useCallback(async (newValue: string) => {
    const success = await updateSetting(key, newValue);
    if (success) {
      setValue(newValue);
      clearSettingsCache(); // Clear cache to ensure consistency
    }
    return success;
  }, [key]);

  useEffect(() => {
    loadSetting();
  }, [loadSetting]);

  return {
    value,
    loading,
    error,
    updateValue,
    refresh: loadSetting
  };
}

/**
 * Hook for form metadata settings (commonly used)
 */
export function useFormMetadata() {
  const [metadata, setMetadata] = useState<{
    companyWebsite: string | null;
    reviewDate: string | null;
  }>({
    companyWebsite: null,
    reviewDate: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMetadata = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [companyWebsite, reviewDate] = await Promise.all([
        getSetting('company_website'),
        getSetting('review_date')
      ]);

      setMetadata({
        companyWebsite,
        reviewDate
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load form metadata';
      setError(errorMessage);
      console.error('Error loading form metadata:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMetadata = useCallback(async (updates: Partial<typeof metadata>) => {
    const settingsToUpdate = [];
    
    if (updates.companyWebsite !== undefined) {
      settingsToUpdate.push({ key: 'company_website', value: updates.companyWebsite || '' });
    }
    
    if (updates.reviewDate !== undefined) {
      settingsToUpdate.push({ key: 'review_date', value: updates.reviewDate || '' });
    }

    if (settingsToUpdate.length === 0) return true;

    const success = await updateSettings(settingsToUpdate);
    if (success) {
      await loadMetadata();
    }
    return success;
  }, [loadMetadata]);

  useEffect(() => {
    loadMetadata();
  }, [loadMetadata]);

  return {
    metadata,
    loading,
    error,
    updateMetadata,
    refresh: loadMetadata
  };
}
