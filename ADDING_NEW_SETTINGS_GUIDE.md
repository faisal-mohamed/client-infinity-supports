# Adding New Settings Categories & Fields - Complete Guide

## 🎯 Overview
This guide shows you exactly how to add new categories and fields to the settings system.

## 📋 Method 1: Add to Default Settings (Recommended)

### **Step 1: Update Default Settings in SettingsPageClient.tsx**

Find the `initializeDefaultSettings` function around line 114 and add your new settings:

```typescript
const initializeDefaultSettings = async () => {
  const defaultSettings = [
    // Existing settings
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
    
    // 🎯 ADD NEW SETTINGS HERE:
    
    // New Company Category Settings
    {
      key: 'company_name',
      value: '',
      type: 'string',
      category: 'company',
      label: 'Company Name',
      description: 'Official company name',
      isRequired: true,
      defaultValue: '',
      sortOrder: 1
    },
    {
      key: 'company_address',
      value: '',
      type: 'string',
      category: 'company',
      label: 'Company Address',
      description: 'Company physical address',
      isRequired: false,
      defaultValue: '',
      sortOrder: 2
    },
    {
      key: 'support_email',
      value: '',
      type: 'email',
      category: 'company',
      label: 'Support Email',
      description: 'Email address for customer support',
      isRequired: false,
      defaultValue: '',
      sortOrder: 3
    },
    
    // New System Category Settings
    {
      key: 'max_file_size',
      value: '10',
      type: 'number',
      category: 'system',
      label: 'Max File Size (MB)',
      description: 'Maximum file upload size in megabytes',
      isRequired: true,
      defaultValue: '10',
      sortOrder: 1
    },
    {
      key: 'enable_notifications',
      value: 'true',
      type: 'boolean',
      category: 'system',
      label: 'Enable Notifications',
      description: 'Enable email notifications for form submissions',
      isRequired: false,
      defaultValue: 'true',
      sortOrder: 2
    },
    
    // New Email Category Settings
    {
      key: 'smtp_host',
      value: '',
      type: 'string',
      category: 'email',
      label: 'SMTP Host',
      description: 'SMTP server hostname',
      isRequired: false,
      defaultValue: '',
      sortOrder: 1
    },
    {
      key: 'smtp_port',
      value: '587',
      type: 'number',
      category: 'email',
      label: 'SMTP Port',
      description: 'SMTP server port number',
      isRequired: false,
      defaultValue: '587',
      sortOrder: 2
    }
  ];

  // Rest of the function remains the same...
};
```

### **Step 2: Update Category Configuration**

In the same file, find `categoryConfig` around line 40 and add your new categories:

```typescript
const categoryConfig = {
  form_metadata: {
    label: 'Form Metadata',
    icon: FaFileAlt,
    description: 'Common data used across all forms',
    color: 'text-blue-600 bg-blue-100'
  },
  company: {
    label: 'Company Information',
    icon: FaBuilding,
    description: 'Organization details and branding',
    color: 'text-green-600 bg-green-100'
  },
  system: {
    label: 'System Settings',
    icon: FaCog,
    description: 'Application behavior and preferences',
    color: 'text-gray-600 bg-gray-100'
  },
  email: {
    label: 'Email Configuration',
    icon: FaEnvelope,
    description: 'Email templates and SMTP settings',
    color: 'text-purple-600 bg-purple-100'
  },
  security: {
    label: 'Security Settings',
    icon: FaShieldAlt,
    description: 'Authentication and access control',
    color: 'text-red-600 bg-red-100'
  },
  
  // 🎯 ADD NEW CATEGORIES HERE:
  pdf: {
    label: 'PDF Settings',
    icon: FaFilePdf,
    description: 'PDF generation and formatting options',
    color: 'text-orange-600 bg-orange-100'
  },
  integrations: {
    label: 'Integrations',
    icon: FaPlug,
    description: 'Third-party service integrations',
    color: 'text-indigo-600 bg-indigo-100'
  }
};
```

### **Step 3: Add Required Icons (if using new ones)**

Add any new icons to the imports at the top of the file:

```typescript
import { 
  FaSave, FaSpinner, FaCog, FaBuilding, FaFileAlt, 
  FaEnvelope, FaShieldAlt, FaGlobe, FaCalendarAlt,
  FaCheck, FaTimes, FaExclamationTriangle, FaPlus,
  FaEdit, FaTrash, FaEye, FaEyeSlash,
  FaFilePdf, FaPlug  // 🎯 Add new icons here
} from 'react-icons/fa';
```

## 📋 Method 2: Add via API (Runtime)

### **Using the Settings API:**

```typescript
// Add a single setting
const response = await fetch('/api/settings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    key: 'new_setting_key',
    value: 'default_value',
    type: 'string',
    category: 'new_category',
    label: 'New Setting Label',
    description: 'Description of the new setting',
    isRequired: false,
    defaultValue: 'default_value',
    sortOrder: 1
  })
});
```

### **Using the Utility Functions:**

```typescript
import { updateSettings } from '@/lib/settings';

const newSettings = [
  {
    key: 'new_setting_1',
    value: 'value1'
  },
  {
    key: 'new_setting_2', 
    value: 'value2'
  }
];

await updateSettings(newSettings);
```

## 🎯 Setting Field Types

### **Supported Types:**

1. **`string`** - Text input
2. **`url`** - URL input with validation
3. **`email`** - Email input with validation
4. **`number`** - Number input
5. **`date`** - Date picker
6. **`boolean`** - Toggle switch
7. **`json`** - For complex data (future use)

### **Field Properties:**

```typescript
{
  key: 'unique_setting_key',           // Unique identifier
  value: 'current_value',              // Current value
  type: 'string',                      // Input type
  category: 'category_name',           // Category grouping
  label: 'Human Readable Label',       // Display name
  description: 'Help text',            // Optional description
  isRequired: true,                    // Required field
  defaultValue: 'default',             // Default value
  validation: '{"minLength": 5}',      // JSON validation rules
  sortOrder: 1,                        // Order within category
  isActive: true                       // Enable/disable setting
}
```

## 🚀 Complete Example: Adding PDF Settings

### **Step 1: Add to initializeDefaultSettings:**

```typescript
// Add these to the defaultSettings array:
{
  key: 'pdf_header_text',
  value: '',
  type: 'string',
  category: 'pdf',
  label: 'PDF Header Text',
  description: 'Text to appear in PDF headers',
  isRequired: false,
  defaultValue: '',
  sortOrder: 1
},
{
  key: 'pdf_footer_text',
  value: '',
  type: 'string',
  category: 'pdf',
  label: 'PDF Footer Text',
  description: 'Text to appear in PDF footers',
  isRequired: false,
  defaultValue: '',
  sortOrder: 2
},
{
  key: 'pdf_font_size',
  value: '12',
  type: 'number',
  category: 'pdf',
  label: 'PDF Font Size',
  description: 'Default font size for PDF generation',
  isRequired: true,
  defaultValue: '12',
  sortOrder: 3
}
```

### **Step 2: Add PDF category to categoryConfig:**

```typescript
pdf: {
  label: 'PDF Settings',
  icon: FaFilePdf,
  description: 'PDF generation and formatting options',
  color: 'text-orange-600 bg-orange-100'
}
```

### **Step 3: Import FaFilePdf icon:**

```typescript
import { FaFilePdf } from 'react-icons/fa';
```

## 🔄 How to Reset/Reinitialize Settings

### **Method 1: Clear Database Table**
```sql
DELETE FROM app_settings;
```
Then refresh the settings page - it will auto-initialize.

### **Method 2: Add New Settings to Existing**
Just add new settings to the `initializeDefaultSettings` function and they'll be created when the page loads.

### **Method 3: Force Reinitialize**
Add this temporary code to force reinitialize:

```typescript
// In loadSettings function, temporarily change this line:
if (Object.keys(data.settings).length === 0) {
  await initializeDefaultSettings();
}

// To this (to force reinitialize):
if (true) { // This will always reinitialize
  await initializeDefaultSettings();
}
```

## 🎯 Best Practices

### **✅ Naming Conventions:**
- **Keys**: Use snake_case (e.g., `company_website`)
- **Categories**: Use snake_case (e.g., `form_metadata`)
- **Labels**: Use Title Case (e.g., `Company Website`)

### **✅ Organization:**
- Group related settings in same category
- Use sortOrder to control display order
- Provide clear descriptions for all settings

### **✅ Validation:**
- Mark required fields appropriately
- Add validation rules for complex fields
- Provide sensible default values

## 🎉 Result

After adding new settings:
1. **Refresh the settings page** (`/admin/settings`)
2. **New categories** will appear in the sidebar
3. **New fields** will be available for configuration
4. **Settings are immediately usable** via hooks and utility functions

The settings system automatically handles:
- ✅ UI generation for new fields
- ✅ Category navigation
- ✅ Input validation
- ✅ Save/reset functionality
- ✅ Integration with existing code
