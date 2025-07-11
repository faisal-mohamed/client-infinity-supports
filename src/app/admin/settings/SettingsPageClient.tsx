"use client";

import { useState, useEffect } from 'react';
import { 
  FaSave, FaSpinner, FaCog, FaBuilding, FaFileAlt, 
  FaEnvelope, FaShieldAlt, FaGlobe, FaCalendarAlt,
  FaCheck, FaTimes, FaExclamationTriangle, FaPlus,
  FaEdit, FaTrash, FaEye, FaEyeSlash, FaFilePdf, FaPlug,
  FaArrowLeft
} from 'react-icons/fa';
import { useToast } from '@/components/ui/Toast';
import Link from 'next/link';

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
    color: 'from-blue-500 to-blue-600'
  },
  
  form_ids: {
    label: 'Form IDs',
    icon: FaCog,
    description: 'IDs assigned to different forms',
    color: 'from-gray-500 to-gray-600'
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
    
    const baseInputClasses = "w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md";
    
    switch (setting.type) {
      case 'url':
        return (
          <div className="relative">
            <div className="absolute left-4 top-4 p-2 rounded-lg bg-blue-100 text-blue-600">
              <FaGlobe className="h-4 w-4" />
            </div>
            <input
              type="url"
              value={currentValue}
              onChange={(e) => handleValueChange(setting.key, e.target.value)}
              placeholder={setting.defaultValue || 'https://example.com'}
              className={`${baseInputClasses} pl-16`}
              required={setting.isRequired}
            />
          </div>
        );
        
      case 'date':
        return (
          <div className="relative">
            <div className="absolute left-4 top-4 p-2 rounded-lg bg-purple-100 text-purple-600">
              <FaCalendarAlt className="h-4 w-4" />
            </div>
            <input
              type="date"
              value={currentValue}
              onChange={(e) => handleValueChange(setting.key, e.target.value)}
              className={`${baseInputClasses} pl-16`}
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
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <button
              type="button"
              onClick={() => handleValueChange(setting.key, currentValue === 'true' ? 'false' : 'true')}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-200 shadow-md ${
                currentValue === 'true' 
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600' 
                  : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-lg ${
                  currentValue === 'true' ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-semibold ${
              currentValue === 'true' ? 'text-indigo-700' : 'text-gray-600'
            }`}>
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
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-t-indigo-500 border-indigo-200 rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Loading Settings</h3>
          <p className="text-gray-600 font-medium">Please wait while we fetch your configuration...</p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  const categories = Object.keys(settings).length > 0 ? Object.keys(settings) : ['form_metadata'];
  const currentSettings = settings[activeCategory] || [];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link
                href="/admin/dashboard"
                className="p-3 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-600 hover:from-indigo-200 hover:to-indigo-300 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <FaArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
                  <FaCog className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Settings</h1>
                  <p className="text-base text-gray-600">Manage application settings and form metadata</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-500">Configuration panel</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Save Actions */}
            {hasChanges && (
              <div className="flex items-center gap-3">
                <button
                  onClick={resetChanges}
                  className="inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <FaTimes className="h-4 w-4" />
                  Reset
                </button>
                <button
                  onClick={saveSettings}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
                >
                  {saving ? (
                    <FaSpinner className="h-4 w-4 animate-spin" />
                  ) : (
                    <FaSave className="h-4 w-4" />
                  )}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Enhanced Sidebar Navigation - Mobile: Full width, Desktop: Fixed width */}
          <div className="w-full lg:w-80 lg:flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden lg:sticky lg:top-8 hover:shadow-xl transition-shadow duration-300">
              <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <FaCog className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Settings Categories</h3>
                </div>
              </div>
              
              {/* Mobile: Horizontal scroll, Desktop: Vertical stack */}
              <nav className="p-4">
                <div className="flex lg:flex-col gap-3 lg:gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
                  {categories.map((category, index) => {
                    const config = categoryConfig[category as keyof typeof categoryConfig] || {
                      label: category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                      icon: FaCog,
                      description: '',
                      color: 'from-gray-500 to-gray-600'
                    };
                    const Icon = config.icon;
                    const isActive = activeCategory === category;
                    
                    return (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`flex-shrink-0 lg:flex-shrink lg:w-full flex items-center p-4 rounded-xl text-left transition-all duration-200 min-w-[200px] lg:min-w-0 ${
                          isActive
                            ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border-2 border-indigo-200 shadow-md'
                            : 'text-gray-700 hover:bg-gray-50 border-2 border-transparent hover:border-gray-200 hover:shadow-md'
                        }`}
                        style={{
                          animationDelay: `${index * 50}ms`,
                          animation: 'fadeInLeft 0.6s ease-out forwards'
                        }}
                      >
                        <div className={`p-3 rounded-xl mr-4 bg-gradient-to-br ${config.color} text-white shadow-md flex-shrink-0`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-base truncate">{config.label}</div>
                          {config.description && (
                            <div className="text-sm text-gray-500 mt-1 hidden lg:block">{config.description}</div>
                          )}
                        </div>
                        {isActive && (
                          <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </nav>
            </div>
          </div>

          {/* Enhanced Main Content - Responsive width */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Enhanced Category Header */}
              <div className="px-4 sm:px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                {(() => {
                  const config = categoryConfig[activeCategory as keyof typeof categoryConfig] || {
                    label: activeCategory.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                    icon: FaCog,
                    description: '',
                    color: 'from-gray-500 to-gray-600'
                  };
                  const Icon = config.icon;
                  
                  return (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${config.color} text-white shadow-lg`}>
                        <Icon className="h-7 w-7" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{config.label}</h2>
                        {config.description && (
                          <p className="text-gray-600 mt-1 text-sm sm:text-base">{config.description}</p>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Enhanced Settings Form - Responsive padding */}
              <div className="p-4 sm:p-8">
                {currentSettings.length === 0 ? (
                  <div className="text-center py-12 sm:py-16">
                    <div className="p-6 sm:p-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 flex items-center justify-center">
                      <FaCog className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">No Settings Found</h3>
                    <p className="text-gray-600 mb-4 max-w-md mx-auto leading-relaxed text-sm sm:text-base px-4">No settings are configured for this category yet.</p>
                    <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200 max-w-lg mx-auto">
                      <p className="text-sm font-medium text-blue-700">
                        ℹ️ Settings will appear here once they are configured in the system
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 sm:space-y-8">
                    {currentSettings.map((setting, index) => (
                      <div 
                        key={setting.id} 
                        className="border-2 border-gray-200 rounded-2xl p-4 sm:p-8 hover:border-indigo-200 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50"
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animation: 'fadeInUp 0.6s ease-out forwards'
                        }}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4">
                          <div className="flex-1 min-w-0">
                            <label className="block text-base sm:text-lg font-bold text-gray-900 mb-2">
                              {setting.label}
                              {setting.isRequired && (
                                <span className="text-red-500 ml-2 text-xl">*</span>
                              )}
                            </label>
                            {setting.description && (
                              <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">{setting.description}</p>
                            )}
                          </div>
                          
                          {editedValues[setting.key] !== undefined && (
                            <div className="flex-shrink-0">
                              <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 shadow-md">
                                <FaEdit className="h-3 w-3" />
                                Modified
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* Responsive input container */}
                        <div className="w-full">
                          {renderSettingInput(setting)}
                        </div>
                        
                        {/* Enhanced Setting metadata - Responsive layout */}
                        <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <span className="bg-gray-100 px-3 py-1 rounded-full font-mono text-gray-700 text-xs sm:text-sm inline-block">
                              {setting.key}
                            </span>
                            <span className="text-gray-500 text-xs sm:text-sm">
                              Type: <span className="font-semibold">{setting.type}</span>
                            </span>
                          </div>
                          <span className="text-gray-500 text-xs sm:text-sm">
                            Updated: {new Date(setting.updatedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
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

      {/* Enhanced Responsive Sticky Save Bar */}
      {hasChanges && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl z-50 backdrop-blur-sm bg-opacity-95">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-sm sm:text-base">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                  <FaExclamationTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span className="font-semibold text-gray-900">You have unsaved changes</span>
              </div>
              
              <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <button
                  onClick={resetChanges}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <FaTimes className="h-4 w-4" />
                  <span className="hidden sm:inline">Reset Changes</span>
                  <span className="sm:hidden">Reset</span>
                </button>
                <button
                  onClick={saveSettings}
                  disabled={saving}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
                >
                  {saving ? (
                    <FaSpinner className="h-4 w-4 animate-spin" />
                  ) : (
                    <FaSave className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">{saving ? 'Saving Changes...' : 'Save All Changes'}</span>
                  <span className="sm:hidden">{saving ? 'Saving...' : 'Save'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Animations */}
      <style jsx>{`
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
      `}</style>
    </div>
  );
}
