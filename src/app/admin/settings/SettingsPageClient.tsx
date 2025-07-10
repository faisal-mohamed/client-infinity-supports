"use client";

import { useState, useEffect } from 'react';
import { 
  FaSave, FaSpinner, FaCog, FaBuilding, FaFileAlt, 
  FaEnvelope, FaShieldAlt, FaGlobe, FaCalendarAlt,
  FaCheck, FaTimes, FaExclamationTriangle, FaPlus,
  FaEdit, FaTrash, FaEye, FaEyeSlash, FaFilePdf, FaPlug
} from 'react-icons/fa';
import { useToast } from '@/components/ui/Toast';

// Types
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
  createdAt: string;
  updatedAt: string;
}

interface GroupedSettings {
  [category: string]: AppSetting[];
}

// Category configurations
const categoryConfig = {
  form_metadata: {
    label: 'Form Metadata',
    icon: FaFileAlt,
    description: 'Common data used across all forms',
    color: 'text-blue-600 bg-blue-100'
  },
  
  form_ids: {
    label: 'Form IDs',
    icon: FaCog,
    description: 'IDs assigned to different forms',
    color: 'text-gray-600 bg-gray-100'
  },
  
};

export default function SettingsPageClient() {
  const { showToast } = useToast();
  
  // State management
  const [settings, setSettings] = useState<GroupedSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('form_metadata');
  const [hasChanges, setHasChanges] = useState(false);
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/settings');
      
      if (!response.ok) {
        throw new Error('Failed to load settings');
      }

      const data = await response.json();
      setSettings(data.settings || {});
      
      // Initialize default settings if none exist
      if (Object.keys(data.settings).length === 0) {
        await initializeDefaultSettings();
      }
      
    } catch (error) {
      console.error('Error loading settings:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load settings',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const initializeDefaultSettings = async () => {
    const defaultSettings = [
      {
        key: 'company_website',
        value: '',
        type: 'url',
        category: 'form_metadata',
        label: 'Company Website',
        description: 'Company website URL that appears on forms',
        isRequired: true,
        defaultValue: '',
        sortOrder: 1
      },
      {
        key: 'review_date',
        value: new Date().toISOString().split('T')[0],
        type: 'date',
        category: 'form_metadata',
        label: 'Review Date',
        description: 'Default review date for forms',
        isRequired: true,
        defaultValue: new Date().toISOString().split('T')[0],
        sortOrder: 2
      },
      {
        key: 'client_intake_form_id',
        value: 'C001',
        type: 'text',
        category: 'form_ids',
        label: 'IDs assigned to each form',
        description: 'IDs for mapping to a form',
        isRequired: true,
        defaultValue: 'C001',
        sortOrder: 2
      }
    ];

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: defaultSettings })
      });

      if (response.ok) {
        await loadSettings();
        showToast({
          type: 'success',
          title: 'Settings Initialized',
          message: 'Default settings have been created',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error initializing settings:', error);
    }
  };

  const handleValueChange = (key: string, value: string) => {
    setEditedValues(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const saveSettings = async () => {
    if (!hasChanges) return;

    try {
      setSaving(true);
      
      const settingsToUpdate = Object.entries(editedValues).map(([key, value]) => ({
        key,
        value
      }));

      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: settingsToUpdate })
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      await loadSettings();
      setEditedValues({});
      setHasChanges(false);

      showToast({
        type: 'success',
        title: 'Settings Saved',
        message: 'Your settings have been updated successfully',
        duration: 3000,
      });

    } catch (error) {
      console.error('Error saving settings:', error);
      showToast({
        type: 'error',
        title: 'Save Failed',
        message: 'Failed to save settings. Please try again.',
        duration: 5000,
      });
    } finally {
      setSaving(false);
    }
  };

  const resetChanges = () => {
    setEditedValues({});
    setHasChanges(false);
    showToast({
      type: 'info',
      title: 'Changes Reset',
      message: 'All unsaved changes have been discarded',
      duration: 3000,
    });
  };

  const renderSettingInput = (setting: AppSetting) => {
    const currentValue = editedValues[setting.key] ?? setting.value ?? setting.defaultValue ?? '';
    
    const baseInputClasses = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors";
    
    switch (setting.type) {
      case 'url':
        return (
          <div className="relative">
            <FaGlobe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="url"
              value={currentValue}
              onChange={(e) => handleValueChange(setting.key, e.target.value)}
              placeholder={setting.defaultValue || 'https://example.com'}
              className={`${baseInputClasses} pl-10`}
              required={setting.isRequired}
            />
          </div>
        );
        
      case 'date':
        return (
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="date"
              value={currentValue}
              onChange={(e) => handleValueChange(setting.key, e.target.value)}
              className={`${baseInputClasses} pl-10`}
              required={setting.isRequired}
            />
          </div>
        );
        
      case 'number':
        return (
          <input
            type="number"
            value={currentValue}
            onChange={(e) => handleValueChange(setting.key, e.target.value)}
            placeholder={setting.defaultValue}
            className={baseInputClasses}
            required={setting.isRequired}
          />
        );
        
      case 'boolean':
        return (
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => handleValueChange(setting.key, currentValue === 'true' ? 'false' : 'true')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                currentValue === 'true' ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  currentValue === 'true' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-sm text-gray-700">
              {currentValue === 'true' ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        );
        
      default:
        return (
          <input
            type="text"
            value={currentValue}
            onChange={(e) => handleValueChange(setting.key, e.target.value)}
            placeholder={setting.defaultValue}
            className={baseInputClasses}
            required={setting.isRequired}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading Settings...</p>
        </div>
      </div>
    );
  }

  const categories = Object.keys(settings).length > 0 ? Object.keys(settings) : ['form_metadata'];
  const currentSettings = settings[activeCategory] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
              <p className="text-gray-600">Manage application settings and form metadata</p>
            </div>
            
            {/* Save Actions */}
            {hasChanges && (
              <div className="flex items-center space-x-3 ml-6">
                <button
                  onClick={resetChanges}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  <FaTimes className="mr-2 h-4 w-4" />
                  Reset
                </button>
                <button
                  onClick={saveSettings}
                  disabled={saving}
                  className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <FaSave className="mr-2 h-4 w-4" />
                  )}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-8">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Categories</h3>
              </div>
              <nav className="p-2">
                {categories.map((category) => {
                  const config = categoryConfig[category as keyof typeof categoryConfig] || {
                    label: category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                    icon: FaCog,
                    description: '',
                    color: 'text-gray-600 bg-gray-100'
                  };
                  const Icon = config.icon;
                  const isActive = activeCategory === category;
                  
                  return (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`w-full flex items-center px-3 py-3 rounded-lg text-left transition-all duration-200 ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`p-2 rounded-lg mr-3 ${isActive ? config.color : 'text-gray-400 bg-gray-100'}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{config.label}</div>
                        {config.description && (
                          <div className="text-xs text-gray-500 mt-1">{config.description}</div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Category Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                {(() => {
                  const config = categoryConfig[activeCategory as keyof typeof categoryConfig] || {
                    label: activeCategory.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                    icon: FaCog,
                    description: '',
                    color: 'text-gray-600 bg-gray-100'
                  };
                  const Icon = config.icon;
                  
                  return (
                    <div className="flex items-center">
                      <div className={`p-3 rounded-lg mr-4 ${config.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">{config.label}</h2>
                        {config.description && (
                          <p className="text-gray-600 mt-1">{config.description}</p>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Settings Form */}
              <div className="p-6">
                {currentSettings.length === 0 ? (
                  <div className="text-center py-12">
                    <FaCog className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Settings Found</h3>
                    <p className="text-gray-600 mb-4">No settings are configured for this category yet.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {currentSettings.map((setting) => (
                      <div key={setting.id} className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <label className="block text-sm font-semibold text-gray-900 mb-1">
                              {setting.label}
                              {setting.isRequired && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                            </label>
                            {setting.description && (
                              <p className="text-sm text-gray-600 mb-3">{setting.description}</p>
                            )}
                          </div>
                          
                          {editedValues[setting.key] !== undefined && (
                            <div className="ml-4">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                <FaEdit className="mr-1 h-3 w-3" />
                                Modified
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {renderSettingInput(setting)}
                        
                        {/* Setting metadata */}
                        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                          <span>Key: {setting.key}</span>
                          <span>Last updated: {new Date(setting.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Save Bar (appears at bottom when changes exist) */}
      {hasChanges && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <FaExclamationTriangle className="h-4 w-4 text-amber-500 mr-2" />
                You have unsaved changes
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={resetChanges}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  <FaTimes className="mr-2 h-4 w-4" />
                  Reset Changes
                </button>
                <button
                  onClick={saveSettings}
                  disabled={saving}
                  className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <FaSave className="mr-2 h-4 w-4" />
                  )}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
